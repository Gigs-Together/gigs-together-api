import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { BotMiddleware } from './bot.middleware';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    AuthModule,
    HttpModule.register({
      baseURL: `https://api.telegram.org/bot${process.env.BOT_TOKEN}`,
    }),
  ],
  providers: [BotService],
  controllers: [BotController],
  exports: [BotService],
})
export class BotModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BotMiddleware).forRoutes('bot');
  }
}
