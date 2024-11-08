import { Controller, HttpCode, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { BotService } from './bot.service';
import { AdminGuard } from '../admin/admin.guard';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('webhook')
  @HttpCode(200)
  @UseGuards(AdminGuard)
  async handleWebhook(
    @Req() req: Request & { body: { message?: any } },
  ): Promise<void> {
    if (req.body.message) {
      await this.botService.handleMessage(req.body.message);
    }
  }
}
