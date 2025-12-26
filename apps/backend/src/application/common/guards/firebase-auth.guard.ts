import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import * as admin from "firebase-admin";
import { UserRepository } from "src/domain/users/repositories/user.repository";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject('FIREBASE_ADMIN')
        private readonly firebaseAdmin: typeof admin,
        private readonly userRepo: UserRepository
    ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'];
        const queryPram = req.query;
        const { user_exist } = queryPram;

        if(!authHeader){
            throw new UnauthorizedException('Missing Authorization header');
        }

        const [type, token] = authHeader.split(' ');

        if(type !== 'Bearer' || !token){
            throw new UnauthorizedException('Invalid Authorization header');
        }

        try{
            const decoded = await this.firebaseAdmin
            .auth()
            .verifyIdToken(token);

            const userData = await admin.auth().getUser(decoded.uid);

            // If user are registring
            if(user_exist === "false"){
                req.user = {
                    uid: decoded.uid,
                    email: decoded.email,
                    username: userData.displayName
                };
                
                return true;
            }

            // If user is already registered.
            const user = await this.userRepo.findUserByFirebaseUid(decoded.uid);

            if(!user){
                throw new ForbiddenException("User not registered");
            }

            req.user = {
                id: user.id,
                uid: decoded.uid,
                email: decoded.email,
                username: userData.displayName
            };

            return true;
        }
        catch(err){
            throw new UnauthorizedException('Invalid Firebase token');
        }
    }
}