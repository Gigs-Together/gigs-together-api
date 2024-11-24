import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { UserModule } from '../user/user.module';
import { BotMiddleware } from './bot.middleware';

@Module({
  imports: [UserModule],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BotMiddleware).forRoutes(BotController);
  }
}
