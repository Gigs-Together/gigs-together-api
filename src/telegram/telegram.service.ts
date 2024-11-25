import { Injectable } from '@nestjs/common';
import axios from '../common/axios';
import { MessageDto, SendMessageDto } from './dto/message.dto';
import { UserService } from '../user/user.service';
import * as crypto from 'crypto';

enum Command {
  Start = 'start',
  Suggest = 'suggest',
}

@Injectable()
export class TelegramService {
  constructor(private readonly userService: UserService) {}

  async isAdmin(telegramId: number): Promise<boolean> {
    return this.userService.isAdmin(telegramId);
  }

  private async sendMessage({ chatId, text }: SendMessageDto): Promise<void> {
    const params = {
      chat_id: chatId, // 1-4096 characters after entities parsing
      text,
    };

    return axios.get('sendMessage', { params });
  }

  async handleMessage(message: MessageDto): Promise<void> {
    if (!message) {
      return;
    }
    const messageText = message.text || '';
    const chatId = message.chat.id;

    if (messageText.charAt(0) !== '/') {
      await this.sendMessage({
        chatId,
        text: `You said: "${messageText}"`,
      });
      return;
    }

    const command = messageText.substring(1).toLowerCase();
    await this.handleCommand(command, chatId);
  }

  private async handleCommand(command: string, chatId: number) {
    switch (command) {
      case Command.Start: {
        await this.sendMessage({
          chatId,
          text: `Hi! I'm a Gigs Together bot. I am still in development...`,
        });
        break;
      }
      case Command.Suggest: {
        const text = [
          'Please, enter the following data using an example...\n',
          'Title: The Concert',
          'Date: 01.01.2025',
          'Location: Razzmatazz',
          'Tickets: https://www.ticketmaster.es/event/',
        ].join('\n');
        await this.sendMessage({
          chatId,
          text,
        });
        break;
      }
      default: {
        await this.sendMessage({
          chatId,
          text: `Hey there, I don't know that command.`,
        });
      }
    }
  }

  parseTelegramInitDataString(initData: string): {
    parsedData: Record<string, string>;
    dataCheckString: string;
  } {
    const pairs = initData.split('&');
    const parsedData = {};

    pairs.forEach((pair) => {
      const [key, value] = pair.split('=');
      parsedData[key] = decodeURIComponent(value);
    });

    const keys = Object.keys(parsedData)
      .filter((key) => key !== 'hash')
      .sort();

    return {
      dataCheckString: keys
        .map((key) => `${key}=${parsedData[key]}`)
        .join('\n'),
      parsedData,
    };
  }

  validateTelegramInitData(dataCheckString: string, receivedHash: string) {
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(process.env.BOT_TOKEN)
      .digest();

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (computedHash !== receivedHash) {
      throw new Error('Invalid initData');
    }
  }
}
