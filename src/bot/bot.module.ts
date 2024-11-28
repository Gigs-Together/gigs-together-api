import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { BotMiddleware } from './bot.middleware';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [BotService],
  controllers: [BotController],
})
export class BotModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BotMiddleware).forRoutes('bot');
  }
}
