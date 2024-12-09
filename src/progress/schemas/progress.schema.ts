import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExerciseProgressDocument = HydratedDocument<ExerciseProgress>;

@Schema()
export class SetsAndWeights {
    @Prop({ required: true })
    weight: number;

    @Prop({ required: true })
    reps: number;

    @Prop({ required: true })
    date: Date;
}

export const SetsAndWeightsSchema = SchemaFactory.createForClass(SetsAndWeights);

@Schema({ collection: 'progress' }) // Specify the collection name here
export class ExerciseProgress {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    ownerId: string;

    @Prop({ type: [SetsAndWeightsSchema], required: true })
    sets: SetsAndWeights[];
}

export const ExerciseProgressSchema = SchemaFactory.createForClass(ExerciseProgress);
