import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TelegramService } from './telegram.service';
import { TelegramUserDto, UserDto } from '../common/dto/user.dto';
import { AuthService } from '../auth/auth.service';
import { V1TelegramCreateGigRequestBody } from './dto/requests/v1-telegram-create-gig-request';

@Injectable()
export class TelegramCreateGigMiddleware implements NestMiddleware {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { telegramInitDataString } = req.body as V1TelegramCreateGigRequestBody;

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
      const telegramUser: TelegramUserDto = JSON.parse(parsedData.user);

      const isAdmin = await this.authService.isAdmin(telegramUser.id);

      req.body.user = {
        telegramUser,
        isAdmin,
      } as UserDto;
    } catch (e) {
      throw new ForbiddenException(e);
    }

    next();
  }
}
