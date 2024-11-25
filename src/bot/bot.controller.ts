import { Controller, HttpCode, Post, UseGuards, Body } from '@nestjs/common';
import { BotService } from './bot.service';
import { AdminGuard } from './guards/admin.guard';
import { UpdateDto } from './dto/update.dto';
import { CreateGigDto } from '../gig/dto/gig.dto';
import { AntiBotGuard } from './guards/anti-bot.guard';
import { GigService } from '../gig/gig.service';

@Controller('bot')
export class BotController {
  constructor(
    private readonly botService: BotService,
    private readonly gigService: GigService,
  ) {}

  @Post('bot/webhook')
  @HttpCode(200)
  @UseGuards(AdminGuard)
  async handleUpdate(@Body() update: UpdateDto): Promise<void> {
    await this.botService.handleMessage(update.message);
  }

  @Post('gig')
  @HttpCode(201)
  @UseGuards(AntiBotGuard)
  async createGig(@Body() data: CreateGigDto): Promise<void> {
    await this.gigService.saveGig(data);
  }
}
