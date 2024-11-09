import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbService } from './db.service';
import { UserCrudService } from './userCrud.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // Register the model
  ],
  controllers: [UsersController],
  providers: [UsersService, DbService, UserCrudService],
  exports: [DbService]
})
export class UsersModule { }
