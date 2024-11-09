import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb'; // To handle ObjectId conversion if needed
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from './schemas/user.schema'; // Make sure User interface or class is imported

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

    // Get user by ID
    async getById(userId: string) {
        try {
            // Find the user by ID and exclude the password field
            const user = await this.userModel.findById(userId).select('-password').exec();
            return user;
        } catch (err) {
            console.log("🚀 ~ getById ~ err:", err);
            throw err;
        }
    }

    // Get user by Gmail
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
}
