import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { AdminModule } from '../admin/admin.module';
import { AdminService } from '../admin/admin.service';

@Module({
  imports: [AdminModule],
  controllers: [BotController],
  providers: [BotService, AdminService],
})
export class BotModule {}
