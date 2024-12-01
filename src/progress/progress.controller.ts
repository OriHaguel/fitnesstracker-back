import { Controller, Param, Body, Put, Post, Get, Req } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ExerciseProgress } from './schemas/progress.schema';
import { CreateProgressDto, SetsAndWeights } from './dto/create-progress.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('api/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService,
    private readonly authService: AuthService // Inject AuthService
  ) { }

  @Put()
  async updateProgress(
    @Req() request: Request,
    @Body() updateProgressDto: UpdateProgressDto,
  ): Promise<ExerciseProgress> {
    const result = await this.authService.getLoggedInUser(request);
    return this.progressService.updateProgress(updateProgressDto, result.user._id);
  }
  @Post('new')
  async createProgress(
    @Req() request: Request,
    @Body() CreateProgressDto: CreateProgressDto,
  ): Promise<ExerciseProgress> {
    const result = await this.authService.getLoggedInUser(request);

    return this.progressService.createProgress(CreateProgressDto, result.user._id);
  }
  @Get(':exerciseId')
  async getLastSet(
    @Req() request: Request,
    @Param('exerciseId') exerciseId: string,
  ): Promise<{ name: string; lastSet: SetsAndWeights } | null> {
    const result = await this.authService.getLoggedInUser(request);
    return this.progressService.getLastSetByName(exerciseId, result.user._id);
  }
}
