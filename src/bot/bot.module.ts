import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { UserModule } from '../user/user.module';
import { BotMiddleware, GigMiddleware } from './bot.middleware';
import { GigModule } from '../gig/gig.module';

// TODO: rename module to "telegram"
@Module({
  imports: [UserModule, GigModule],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BotMiddleware)
      .forRoutes({ path: 'bot/bot/webhook', method: RequestMethod.POST });
    consumer
      .apply(GigMiddleware)
      .forRoutes({ path: 'bot/gig', method: RequestMethod.POST });
  }
}
