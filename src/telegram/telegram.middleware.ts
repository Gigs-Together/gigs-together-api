import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TelegramService } from './telegram.service';
import { TelegramUserDto, UserDto } from './dto/user.dto';

@Injectable()
export class TelegramMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const secretHeader = req.headers[
      'x-telegram-bot-api-secret-token'
    ] as string;

    if (secretHeader !== process.env.BOT_SECRET) {
      throw new ForbiddenException('Invalid secret token');
    }

    next();
  }
}

@Injectable()
export class GigMiddleware implements NestMiddleware {
  constructor(private readonly telegramService: TelegramService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { telegramInitDataString } = req.body;

    if (!telegramInitDataString) {
      throw new ForbiddenException('Missing Telegram user data');
    }

    try {
      const { parsedData, dataCheckString } =
        this.telegramService.parseTelegramInitDataString(
          telegramInitDataString,
        );
      this.telegramService.validateTelegramInitData(
        dataCheckString,
        parsedData.hash,
      );
      delete req.body.telegramInitDataString;
      const user: TelegramUserDto = JSON.parse(parsedData.user);
      const isAdmin = await this.telegramService.isAdmin(user.id);
      req.body.user = { ...user, isAdmin } as UserDto;
    } catch (e) {
      throw new ForbiddenException(e);
    }

    next();
  }
}
