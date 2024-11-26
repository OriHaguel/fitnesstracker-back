import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserCrudService } from './userCrud.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }, // Register User schema
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserCrudService],
  exports: [UserCrudService]
})
export class UsersModule { }
