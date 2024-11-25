import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { TelegramService } from '../telegram.service';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly telegramService: TelegramService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const telegramId: number = request.body?.message?.from?.id;

    if (!telegramId) {
      throw new ForbiddenException('User ID is required in the message.');
    }

    const isAdmin = await this.telegramService.isAdmin(telegramId);
    if (isAdmin !== true) {
      throw new ForbiddenException('Access denied. Admin privileges required.');
    }

    return true;
  }
}
