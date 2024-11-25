import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { UserModule } from '../user/user.module';
import { TelegramMiddleware, GigMiddleware } from './telegram.middleware';
import { GigModule } from '../gig/gig.module';

@Module({
  imports: [UserModule, GigModule],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TelegramMiddleware)
      .forRoutes({ path: 'telegram/bot/webhook', method: RequestMethod.POST });
    consumer
      .apply(GigMiddleware)
      .forRoutes({ path: 'telegram/gig', method: RequestMethod.POST });
  }
}
