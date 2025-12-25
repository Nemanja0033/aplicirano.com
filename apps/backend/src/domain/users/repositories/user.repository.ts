import { Injectable } from "@nestjs/common";
import { User, Prisma } from "@prisma/client";
import { PrismaService } from "src/infrastrucutre/database/prisma.service";

@Injectable()
export class UserRepository {
    constructor(private readonly db: PrismaService) {}

    async createUser(user: { uid: string, email: string, username: string}): Promise<User>{
        console.log("@USER IN REPO", user)
        return this.db.user.create({
            data: {
                firebaseUid: user.uid,
                username: user.username,
                email: user.email
            }
        })
    }

    async findUserById(userId: string): Promise<User | null> {
        return this.db.user.findUnique({
            where: { id: userId }
        })
    }

    async findUserByFirebaseUid(uid: string) : Promise<User | null> {
        return this.db.user.findUnique({
            where: { firebaseUid: uid }
        });
    }

}
