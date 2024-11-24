import { Controller, Param, Body, Put, Post, Get } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ExerciseProgress } from './schemas/progress.schema';
import { CreateProgressDto, SetsAndWeights } from './dto/create-progress.dto';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) { }

  @Put(':id')
  async updateProgress(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ): Promise<ExerciseProgress> {
    return this.progressService.updateProgress(id, updateProgressDto);
  }
  @Post('new')
  async createProgress(
    @Body() CreateProgressDto: CreateProgressDto,
  ): Promise<ExerciseProgress> {
    return this.progressService.createProgress(CreateProgressDto);
  }
  @Get(':exerciseId')
  async getLastSet(
    @Param('exerciseId') exerciseId: string,
  ): Promise<{ name: string; lastSet: SetsAndWeights } | null> {
    return this.progressService.getLastSetByName(exerciseId);
  }
}
