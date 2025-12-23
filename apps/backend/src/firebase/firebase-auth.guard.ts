import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import * as admin from "firebase-admin";
import { JobApplicationsRepository } from "src/job-applications/repositories/job-application.repository";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject('FIREBASE_ADMIN')
        private readonly firebaseAdmin: typeof admin,
        private readonly jobRepo: JobApplicationsRepository
    ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'];

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

            const user = await this.jobRepo.findUserByFirebaseUid(decoded.uid);

            if(!user){
                throw new ForbiddenException("User not registered");
            }

            req.user = {
                id: user.id,
                uid: decoded.uid,
                email: decoded.email,
            };

            return true
        }
        catch{
            throw new UnauthorizedException('Invalid Firebase token');
        }
    }
}