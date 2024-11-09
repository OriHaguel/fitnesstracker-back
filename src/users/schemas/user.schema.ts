// src/users/schemas/user.schema.ts
import { Schema, Document } from 'mongoose';

export interface User extends Document {
    username: string;
    password: string;
    gmail: string;
    weight: {
        weight: number;
        date: Date;
    }[];
    workouts: {
        _id: string;
        name: string;
        type: string;
        exercise: {
            sets: number;
            weight: number;
            reps: number;
            name: string;
        }[];
    }[];
}

export const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    gmail: { type: String, required: true, unique: true },
    weight: [
        {
            weight: { type: Number, required: true },
            date: { type: Date, required: true },
        },
    ],
    workouts: [
        {
            _id: { type: String, required: true },
            name: { type: String, required: true },
            type: { type: String, required: true },
            exercise: [
                {
                    sets: { type: Number, required: true },
                    weight: { type: Number, required: true },
                    reps: { type: Number, required: true },
                    name: { type: String, required: true },
                },
            ],
        },
    ],
},
    {
        collection: 'user', // Specify your custom collection name
    }
);
