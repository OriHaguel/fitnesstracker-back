import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsDate, ValidateNested, IsNumber } from 'class-validator';

export class UpdateExerciseDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    sets?: number;

    @IsOptional()
    @IsNumber()
    weight?: number;

    @IsOptional()
    @IsNumber()
    reps?: number;
}

export class UpdateWorkoutDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date) // Ensures the string is transformed into a Date object
    date?: Date;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateExerciseDto)
    exercise?: UpdateExerciseDto[];
}
