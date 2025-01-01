import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { NewWorkoutDto } from './dto/newworkout.dto';
import { UpdateWorkoutDto } from './dto/updateworkout.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
  ) { }

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }
  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.login(createUserDto);
    return user
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @Patch(':userId/workouts/:workoutId/exercise')
  @Put(':userId/workouts/:workoutId/exercise')
  update(
    @Param('userId') userId: string,
    @Param('workoutId') workoutId: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.usersService.update(userId, workoutId, updateExerciseDto);
  }
  @Put(':userId/workouts/:workoutId/')
  workoutToUpdate(
    @Param('userId') userId: string,
    @Param('workoutId') workoutId: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
  ) {
    return this.usersService.updateWorkout(userId, workoutId, updateWorkoutDto);
  }
  @Put(':userId/weight')
  weightToUpdate(
    @Param('userId') userId: string,
    @Body() body: { weight: number },
  ) {
    console.log("🚀 ~ UsersController ~ body:", body)
    return this.usersService.updateWeight(userId, body.weight);
  }

  @Post(':userId/workouts/:workoutId/exercise')
  add(
    @Param('userId') userId: string,
    @Param('workoutId') workoutId: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.usersService.post(userId, workoutId, updateExerciseDto);
  }
  @Post(':userId/workout')
  async addWorkout(
    @Param('userId') userId: string,
    @Body() workoutData: NewWorkoutDto
  ) {
    return this.usersService.addWorkout(userId, workoutData);
  }
  @Delete(':userId/workouts/:workoutId')
  remove(
    @Param('userId') userId: string,
    @Param('workoutId') workoutId: string,
  ) {
    return this.usersService.remove(userId, workoutId);
  }
  @Delete(':userId/workouts/:workoutId/exercise')
  removeExercise(
    @Param('userId') userId: string,
    @Param('workoutId') workoutId: string,
    @Body() exerciseName: { name: string },

  ) {
    return this.usersService.removeExercise(userId, workoutId, exerciseName);
  }
  @Delete(':userId/:workoutId/date')
  async deleteDate(
    @Param('userId') userId: string,
    @Param('workoutId') workoutId: string,
    @Body() dateToDelete: { date: Date }

  ) {
    return this.usersService.deleteDate(userId, workoutId, dateToDelete.date);
  }
}

