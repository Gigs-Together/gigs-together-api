import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TelegramService } from './telegram.service';

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

  use(req: Request, res: Response, next: NextFunction): void {
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
      req.body.user = JSON.parse(parsedData.user);
    } catch (e) {
      throw new ForbiddenException(e);
    }

    next();
  }
}
