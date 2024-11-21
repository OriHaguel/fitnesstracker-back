import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCrudService } from './userCrud.service';
import { error } from 'console';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { NewWorkoutDto } from './dto/newworkout.dto';
import { UpdateWorkoutDto } from './dto/updateworkout.dto';

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
  async updateWorkout(userId: string, workoutId: string, updateData: UpdateWorkoutDto) {
    return this.userCrudService.updateWorkout(userId, workoutId, updateData)
  }
  async post(userId: string, workoutId: string, updateExerciseDto: UpdateExerciseDto) {
    return this.userCrudService.addExercise(userId, workoutId, updateExerciseDto)
  }

  remove(userId: string, workoutId: string) {
    return this.userCrudService.deleteWorkout(userId, workoutId)
  }

  addWorkout(userId: string, workoutData: NewWorkoutDto) {
    return this.userCrudService.createWorkout(userId, workoutData)
  }
}
