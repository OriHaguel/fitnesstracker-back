import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ExerciseProgress, ExerciseProgressDocument } from './schemas/progress.schema';
import { CreateProgressDto, SetsAndWeights } from './dto/create-progress.dto';

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

    // Append new sets to the existing ones
    if (updateProgressDto.sets && Array.isArray(updateProgressDto.sets)) {
      progress.sets.push(...updateProgressDto.sets);
    }

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

  async getSet(exerciseId: string, afterSetId: string | null): Promise<SetsAndWeights | null> {
    // Construct the query to fetch the exercise by ID
    const query: any = { _id: exerciseId };

    // If there's a last set ID, we fetch the sets that come after it
    if (afterSetId) {
      query['sets._id'] = { $gt: afterSetId }; // This will fetch sets with an _id greater than the provided one
    }

    // Fetch the exercise and the sets field
    const exerciseProgress = await this.exerciseProgressModel.findOne(query).select('sets').sort({ 'sets._id': 1 });

    if (!exerciseProgress || !exerciseProgress.sets || exerciseProgress.sets.length === 0) {
      return null;
    }

    // Get the last set from the sets array
    const lastSet = exerciseProgress.sets[exerciseProgress.sets.length - 1];

    return lastSet ? lastSet : null;
  }

  async getLastSetByName(exerciseName: string): Promise<{ name: string; lastSet: SetsAndWeights } | null> {
    // Fetch the exercise progress document with name and sets
    const exerciseProgress = await this.exerciseProgressModel
      .findOne({ name: exerciseName }) // Query by exerciseName
      .select('name sets')             // Select both 'name' and 'sets' fields
      .sort({ 'sets._id': 1 });        // Sort sets by their _id field (not needed if you trust order in DB)

    // Check if exerciseProgress exists and contains sets
    if (!exerciseProgress || !exerciseProgress.sets || exerciseProgress.sets.length === 0) {
      return null;
    }

    // Return the name and the last set
    return {
      name: exerciseProgress.name,
      lastSet: exerciseProgress.sets[exerciseProgress.sets.length - 1],
    };
  }
}   
