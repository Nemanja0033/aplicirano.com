import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/application/common/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO fix infer type in AuthGuard
  @Post('/register')
  registerUser(@User() user: { uid: string, email: string, username: string }) {
    return this.usersService.registerUser(user);
  }

}
