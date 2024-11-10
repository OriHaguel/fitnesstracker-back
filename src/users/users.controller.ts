import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }
  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.login(createUserDto);
    return user
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
