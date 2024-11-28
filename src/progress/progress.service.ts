import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ExerciseProgress, ExerciseProgressDocument } from './schemas/progress.schema';
import { CreateProgressDto, SetsAndWeights } from './dto/create-progress.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel('ExerciseProgress')
    private readonly exerciseProgressModel: Model<ExerciseProgressDocument>,
  ) { }

  async createProgress(createProgressDto: CreateProgressDto, ownerId: string): Promise<ExerciseProgress> {
    const newProgress = new this.exerciseProgressModel({ ...createProgressDto, ownerId });
    return await newProgress.save();
  }


  async updateProgress(
    updateProgressDto: UpdateProgressDto,
    userId: string
  ): Promise<ExerciseProgress> {
    console.log("🚀 ~ ProgressService ~ userId:", userId)
    const progress = await this.exerciseProgressModel.findOne({ name: updateProgressDto.name, ownerId: userId });
    console.log("🚀 ~ ProgressService ~ progress:", progress)

    if (!progress) {
      throw new NotFoundException(`Progress entry with name "${updateProgressDto.name}" not found`);
    }

    if (updateProgressDto.sets && Array.isArray(updateProgressDto.sets)) {
      progress.sets.push(...updateProgressDto.sets);
    }

    await progress.save();

    return progress;
  }


  // async getSet(exerciseId: string, afterSetId: string | null): Promise<SetsAndWeights | null> {
  //   // Construct the query to fetch the exercise by ID
  //   const query: any = { _id: exerciseId };

  //   // If there's a last set ID, we fetch the sets that come after it
  //   if (afterSetId) {
  //     query['sets._id'] = { $gt: afterSetId }; // This will fetch sets with an _id greater than the provided one
  //   }

  //   // Fetch the exercise and the sets field
  //   const exerciseProgress = await this.exerciseProgressModel.findOne(query).select('sets').sort({ 'sets._id': 1 });

  //   if (!exerciseProgress || !exerciseProgress.sets || exerciseProgress.sets.length === 0) {
  //     return null;
  //   }

  //   // Get the last set from the sets array
  //   const lastSet = exerciseProgress.sets[exerciseProgress.sets.length - 1];

  //   return lastSet ? lastSet : null;
  // }

  async getLastSetByName(exerciseName: string, userId: string): Promise<{ name: string; lastSet: SetsAndWeights } | null> {
    // Fetch the exercise progress document with name and sets
    const exerciseProgress = await this.exerciseProgressModel
      .findOne({ name: exerciseName, ownerId: userId }) // Query by exerciseName
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
