// ExerciseDto for new exercises
import { IsString, IsNumber } from 'class-validator';

export class ExerciseDto {
    @IsString()
    name: string;

    @IsNumber()
    sets: number;

    @IsNumber()
    weight: number;

    @IsNumber()
    reps: number;
}

// NewWorkoutDto uses ExerciseDto
import { Type } from 'class-transformer'; // Correct import for @Type
import { IsArray, ValidateNested } from 'class-validator';

export class NewWorkoutDto {
    @IsString()
    name: string;

    @IsString()
    type: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExerciseDto)
    exercise: ExerciseDto[];
}
