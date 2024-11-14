import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { BotService } from '../bot.service';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly botService: BotService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const telegramId: number = request.body?.message?.from?.id; // TODO: chaining

    if (!telegramId) {
      throw new ForbiddenException('User ID is required in the message.');
    }

    const isAdmin = await this.botService.isAdmin(telegramId);
    if (isAdmin !== true) {
      // TODO: should we keep track of users who tried accessing the bot?
      throw new ForbiddenException('Access denied. Admin privileges required.');
    }

    return true;
  }
}
