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
import { Admin, AdminSchema } from '../schemas/admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    GigModule,
  ],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TelegramMiddleware)
      .forRoutes({ path: 'telegram/webhook', method: RequestMethod.POST });
    consumer
      .apply(GigMiddleware)
      .forRoutes({ path: 'telegram/gig', method: RequestMethod.POST });
  }
}
