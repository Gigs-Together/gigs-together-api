import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { GigModule } from './gig/gig.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `${configService.get<string>('MONGO_URI')}${configService.get<string>('MONGO_DB')}`,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    TelegramModule,
    GigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
