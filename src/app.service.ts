import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) { }

  async getExersices(muscleName: string): Promise<any> {
    const exerciseKey = this.configService.get<string>('EXERCISE_KEY');
    if (!exerciseKey) {
      throw new Error('EXERCISE_KEY is not defined in the environment variables.');
    }

    try {
      const response = await axios.get(`https://api.api-ninjas.com/v1/exercises?muscle=${muscleName}`
        , {
          headers: {
            'X-Api-Key': exerciseKey, // Correct header for API Ninjas
          },
        });
      return response.data
      // return 'hello'

    } catch (error) {
      console.log("🚀 ~ AppService ~ getExersices ~ error:", error)

    }
  }
}
