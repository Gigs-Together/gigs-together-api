import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { BotModule } from '../bot/bot.module';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  imports: [BotModule, CalendarModule],
  providers: [PublisherService],
  exports: [PublisherService],
})
export class PublisherModule {}
