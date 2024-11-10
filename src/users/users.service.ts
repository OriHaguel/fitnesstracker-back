import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCrudService } from './userCrud.service';
import { error } from 'console';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class UsersService {
  constructor(private userCrudService: UserCrudService) { } // Inject UserCrudService

  signup(createUserDto: CreateUserDto) {
    return this.userCrudService.add(createUserDto);
  }
  async login(createUserDto: CreateUserDto) {
    const user = await this.userCrudService.getByUsername(createUserDto.gmail);
    if (!user) throw new Error('can\'t log in')
    delete user.password
    return user
  }

  findAll() {
    console.log('it worksss')
    return `This action returns all users`;
  }

  findOne(id: number | string) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  async update(userId: string, workoutId: string, updateExerciseDto: UpdateExerciseDto) {
    return this.userCrudService.updateExerciseByName(userId, workoutId, updateExerciseDto)
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
