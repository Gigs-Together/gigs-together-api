import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { TelegramMiddleware, GigMiddleware } from './telegram.middleware';
import { GigModule } from '../gig/gig.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    GigModule,
  ],
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
