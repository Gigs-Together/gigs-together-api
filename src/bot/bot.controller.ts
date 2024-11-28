import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UpdateDto } from './dto/update.dto';
import { BotService } from './bot.service';
import { AdminGuard } from './guards/admin.guard';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('webhook')
  @HttpCode(200)
  @UseGuards(AdminGuard)
  async handleUpdate(@Body() update: UpdateDto): Promise<void> {
    await this.botService.handleMessage(update.message);
  }
}
