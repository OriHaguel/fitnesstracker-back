import { IsArray, IsNotEmpty, IsString, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProgressDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SetsAndWeights)
    sets: SetsAndWeights[];
}

export class SetsAndWeights {
    @IsNumber()
    weight: number;

    @IsNumber()
    reps: number;
}
