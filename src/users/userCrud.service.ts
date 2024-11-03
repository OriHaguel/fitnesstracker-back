import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { DbService } from './db.service'; // Ensure you import DbService

@Injectable()
export class UserCrudService {
    constructor(private dbService: DbService) { } // Inject DbService

    async add(user: CreateUserDto) {
        try {
            const userToAdd = {
                username: user.username,
                password: user.password,
                gmail: user.gmail,
                imgUrl: user.imgUrl,
                weight: user.weight,
                workouts: user.workouts
            };
            const collection = await this.dbService.getCollection('user'); // Use this.dbService
            await collection.insertOne(userToAdd);
            return userToAdd;
        } catch (err) {
            console.log("🚀 ~ add ~ err:", err);
            throw err;
        }
    }

    async getById(userId: string) {
        try {
            const criteria = { _id: ObjectId.createFromHexString(userId) };
            const collection = await this.dbService.getCollection('user');
            const user = await collection.findOne(criteria);
            if (user) {
                delete user.password; // Ensure the password is not returned
            }
            return user;
        } catch (err) {
            console.log("🚀 ~ getById ~ err:", err);
            throw err;
        }
    }

    async getByUsername(username: string) {
        try {
            const collection = await this.dbService.getCollection('user');
            const user = await collection.findOne({ username });
            return user;
        } catch (err) {
            console.log("🚀 ~ getByUsername ~ err:", err);
            throw err;
        }
    }

    async update(user: CreateUserDto) {
        try {
            const userToSave = {
                _id: ObjectId.createFromHexString(user._id),
                username: user.username,
            };
            const collection = await this.dbService.getCollection('user');
            await collection.updateOne({ _id: userToSave._id }, { $set: userToSave });
            return userToSave;
        } catch (err) {
            console.log("🚀 ~ update ~ err:", err);
            throw err;
        }
    }
}



