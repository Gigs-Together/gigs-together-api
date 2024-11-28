import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [BotModule],
  providers: [PublisherService],
  exports: [PublisherService],
})
export class PublisherModule {}
