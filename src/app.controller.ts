import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get(':muscleName')
  getExersicesName(
    @Param('muscleName') muscleName: string
  ): Promise<any> {
    return this.appService.getExersicesName(muscleName);
  }
}
