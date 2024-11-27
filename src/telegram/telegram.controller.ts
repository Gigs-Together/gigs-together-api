import {
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { AdminGuard } from './guards/admin.guard';
import { UpdateDto } from './dto/update.dto';
import { SubmitGigDto } from '../gig/dto/gig.dto';
import { AntiBotGuard } from './guards/anti-bot.guard';
import { GigService } from '../gig/gig.service';

@Controller('telegram')
export class TelegramController {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly gigService: GigService,
  ) {}

  @Post('webhook')
  @HttpCode(200)
  @UseGuards(AdminGuard)
  async handleUpdate(@Body() update: UpdateDto): Promise<void> {
    await this.telegramService.handleMessage(update.message);
  }

  @Post('gig')
  @HttpCode(201)
  @UseGuards(AntiBotGuard)
  async createGig(@Body() data: SubmitGigDto): Promise<void> {
    await this.gigService.handleGigSubmit(data);
  }

  @Patch('gig/approve/:id')
  async approveGig(@Param('id') gigId: string): Promise<void> {
    await this.gigService.approveGig(gigId);
  }
}
