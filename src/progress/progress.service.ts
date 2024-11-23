import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ExerciseProgress, ExerciseProgressDocument } from './schemas/progress.schema';
import { CreateProgressDto } from './dto/create-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel('ExerciseProgress')
    private readonly exerciseProgressModel: Model<ExerciseProgressDocument>,
  ) { }

  // Update progress function
  async updateProgress(id: string, updateProgressDto: UpdateProgressDto): Promise<ExerciseProgress> {
    // Find the existing progress entry
    const progress = await this.exerciseProgressModel.findById(id);

    if (!progress) {
      throw new NotFoundException(`Progress entry with ID ${id} not found`);
    }

    // Update the fields with the new data
    Object.assign(progress, updateProgressDto);

    // Save the updated entry
    await progress.save();

    return progress;
  }

  async createProgress(createProgressDto: CreateProgressDto): Promise<ExerciseProgress> {
    // Create a new progress entry with the provided data
    const newProgress = new this.exerciseProgressModel(createProgressDto);

    // Save the new progress entry to the database
    return await newProgress.save();
  }
}
