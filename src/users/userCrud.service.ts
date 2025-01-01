import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { ObjectId } from 'mongodb'; // To handle ObjectId conversion if needed
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from './schemas/user.schema'; // Make sure User interface or class is imported
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { NewWorkoutDto } from './dto/newworkout.dto';
import { UpdateWorkoutDto } from './dto/updateworkout.dto';

@Injectable()
export class UserCrudService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>, // Inject the User model
    ) { }

    // Add a new user
    async add(user: CreateUserDto) {
        try {
            const userToAdd = new this.userModel({
                username: user.username,
                password: user.password,
                gmail: user.gmail,
                weight: user.weight,
                workouts: user.workouts,
            });
            await userToAdd.save(); // Save the user document using Mongoose
            return userToAdd;
        } catch (err) {
            console.log("🚀 ~ add ~ err:", err);
            throw err;
        }
    }

    async updateUser(userId: string, updateData: Partial<CreateUserDto>) {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(
                userId,
                { $set: updateData },
                { new: true } // Return the updated document
            ).exec();

            return updatedUser;
        } catch (err) {
            console.log("🚀 ~ updateUser ~ err:", err);
            throw err;
        }
    }
    // Get user by ID
    async updateExerciseByName(userId: string, workoutId: string, updateExerciseDto: UpdateExerciseDto): Promise<User> {
        // async updateExerciseByName(userId: string, workoutId: string, exerciseName: UpdateExerciseDto, updateExerciseDto: UpdateExerciseDto): Promise<User> {
        // Find the user
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Find the workout
        const workout = user.workouts.find(w => w._id.toString() === workoutId);
        if (!workout) {
            throw new NotFoundException('Workout not found');
        }

        // Find the exercise by name
        const exercise = workout.exercise.find(ex => ex.name === updateExerciseDto.name);
        if (!exercise) {
            throw new NotFoundException('Exercise not found');
        }

        // Update the exercise
        Object.assign(exercise, updateExerciseDto);

        // Save the updated user document
        await user.save();
        return user;
    }


    async addExercise(userId: string, workoutId: string, updateExerciseDto: UpdateExerciseDto): Promise<User> {
        // Find the user
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Find the workout
        const workout = user.workouts.find(w => w._id.toString() === workoutId);
        if (!workout) {
            throw new NotFoundException('Workout not found');
        }

        // Add the new exercise to the workout's exercises array
        workout.exercise.push(updateExerciseDto);

        // Save the updated user document
        await user.save();
        return user;
    }

    async deleteExercise(userId: string, workoutId: string, exerciseName: { name: string }): Promise<User> {
        // Find the user
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Find the workout
        const workout = user.workouts.find(w => w._id.toString() === workoutId);
        if (!workout) {
            throw new NotFoundException('Workout not found');
        }

        // Find the exercise index to remove
        const exerciseIndex = workout.exercise.findIndex(e => e.name === exerciseName.name);
        if (exerciseIndex === -1) {
            throw new NotFoundException('Exercise not found');
        }

        // Remove the exercise from the workout's exercises array
        workout.exercise.splice(exerciseIndex, 1);

        // Save the updated user document
        await user.save();
        return user;
    }


    async createWorkout(userId: string, workoutData: NewWorkoutDto): Promise<User> {
        // Find the user by ID
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Add the new workout to the user's workouts array
        user.workouts.push({
            _id: new mongoose.Types.ObjectId(),
            ...workoutData,
        });

        // Save the updated user document
        await user.save();
        return user;
    }

    async deleteWorkout(userId: string, workoutId: string): Promise<User> {
        const result = await this.userModel.updateOne(
            { _id: userId },
            { $pull: { workouts: { _id: workoutId } } },
        );

        if (result.modifiedCount === 0) {
            throw new NotFoundException('User or workout not found');
        }

        const updatedUser = await this.userModel.findById(userId);
        if (!updatedUser) {
            throw new NotFoundException('User not found after update');
        }

        return updatedUser;
    }


    async updateWorkout(
        userId: string,
        workoutId: string,
        updateData: UpdateWorkoutDto,
    ): Promise<User> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const workout = user.workouts.find(workout => workout._id?.toString() === workoutId);
        if (!workout) {
            throw new NotFoundException('Workout not found');
        }

        // Apply updates to the workout
        Object.assign(workout, updateData);

        await user.save();
        return user;
    }

    async getById(userId: string) {
        try {
            const user = await this.userModel.findById(new Types.ObjectId(userId)).select('-password').exec();
            return user;
        } catch (err) {
            console.log("🚀 ~ getById ~ err:", err);
            throw err;
        }
    }

    async updateWeight(userId: string, weight: number): Promise<User> {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        if (!weight || weight <= 0) {
            throw new Error(`Invalid weight value: ${weight}`);
        }

        user.weight.push({ weight: weight, date: new Date() }); // Ensure `weight` and `date` are always provided

        try {
            return await user.save();
        } catch (error) {
            throw new Error(`Failed to add weight: ${error.message}`);
        }
    }

    async getByUsername(gmail: string) {
        try {
            const user = await this.userModel.findOne({ gmail }).exec();
            return user;
        } catch (err) {
            console.log("🚀 ~ getByUsername ~ err:", err);
            throw err;
        }
    }

    // Update user information
    async update(user: CreateUserDto) {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(
                user._id, // _id is used to find the user
                {
                    username: user.username,
                    password: user.password, // You can choose to exclude this field in some cases for security
                    gmail: user.gmail,
                    weight: user.weight,
                    workouts: user.workouts,
                },
                { new: true } // Return the updated user document
            ).exec();
            return updatedUser;
        } catch (err) {
            console.log("🚀 ~ update ~ err:", err);
            throw err;
        }
    }

    async removeDateFromWorkout(userId: string, workoutId: string, dateToRemove: Date): Promise<User> {
        const user = await this.userModel.findOneAndUpdate(
            {
                _id: userId,
                'workouts._id': workoutId,
            },
            {
                $pull: {
                    'workouts.$.date': dateToRemove,
                },
            },
            { new: true }, // Returns the updated document
        );

        if (!user) {
            throw new NotFoundException('User or workout not found');
        }

        return user;
    }
}

