import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) { }

  async getExersicesName(muscleName: string): Promise<any> {
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
      // console.log(response.data.map(ex => ex.name))
      // return response.data
      return response.data.map(ex => ex.name)
      // return 'hello'

    } catch (error) {
      console.log("🚀 ~ AppService ~ getExersices ~ error:", error)

    }
  }
}
