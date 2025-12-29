import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UserRepository) {}

  async registerUser(user: { uid: string, email: string, username: string}) {
    let userExist = await this.repo.findUserByFirebaseUid(user.uid);

    if(!userExist){
      userExist = await this.repo.createUser(user)
    }

    return userExist;
  }
}
