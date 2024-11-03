import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbService } from './db.service';
import { UserCrudService } from './userCrud.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, DbService, UserCrudService],
})
export class UsersModule { }
