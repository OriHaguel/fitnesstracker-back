import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ExerciseProgressSchema } from './schemas/progress.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ExerciseProgress', schema: ExerciseProgressSchema }
    ]),
    AuthModule
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule { }
