import { Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: Request & { body: { message?: any } },
  ): Promise<void> {
    if (req.body.message) {
      await this.botService.handleMessage(req.body.message);
    }
  }
}
