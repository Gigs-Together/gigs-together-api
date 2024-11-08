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

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.body?.message?.from?.id; // TODO: chaining

    if (!userId) {
      throw new ForbiddenException('User ID is required in the message.');
    }

    if (!this.botService.isAdmin(userId)) {
      // TODO: should we keep track of users who tried accessing the bot?
      throw new ForbiddenException('Access denied. Admin privileges required.');
    }

    return true;
  }
}
