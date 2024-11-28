import { Injectable } from '@nestjs/common';
import { GigDocument } from '../schemas/gig.schema';
import { BotService } from '../bot/bot.service';

@Injectable()
export class PublisherService {
  constructor(
    private readonly botService: BotService,
  ) {}

  async publish(gig: GigDocument): Promise<void> {
    const chatId = process.env.CHANNEL_ID;
    const dateFormatter = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short', // e.g., "Nov"
      day: '2-digit',
    });
    const formattedDate = dateFormatter.format(new Date(gig.date));

    const text = [
      gig.title + '\n',
      'Date: ' + formattedDate,
      'Location: ' + gig.location,
      'Tickets: ' + gig.ticketsUrl,
    ].join('\n');
    await this.botService.sendMessage({ chatId, text });
  }
}
