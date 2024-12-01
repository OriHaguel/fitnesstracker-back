import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressModule } from './progress/progress.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Ensures ConfigService is available in this module
      useFactory: async (configService: ConfigService) => {
        const mongoUrl = configService.get<string>('MONGO_URL');
        // const dbName = configService.get<string>('DB_NAME');

        if (!mongoUrl) {
          throw new Error('MONGO_URL or DB_NAME not defined in the environment variables');
        }

        return {
          uri: `${mongoUrl}`,
        };
      },
      inject: [ConfigService], // Inject ConfigService to use in the factory function
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UsersModule,
    ProgressModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
