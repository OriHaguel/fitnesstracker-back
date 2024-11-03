import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCrudService } from './userCrud.service';

@Injectable()
export class UsersService {
  constructor(private userCrudService: UserCrudService) { } // Inject UserCrudService

  signup(createUserDto: CreateUserDto) {
    return this.userCrudService.add(createUserDto);
  }

  findAll() {
    console.log('it worksss')
    return `This action returns all users`;
  }

  findOne(id: number | string) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
