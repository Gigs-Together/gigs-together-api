import { Injectable } from '@nestjs/common';
import axios from '../common/axios';
import { MessageDto, SendMessageDto } from './dto/message.dto';
import { UserService } from '../user/user.service';
import * as crypto from 'crypto';
import { UserDto } from './dto/user.dto';

enum Command {
  Start = 'start',
  Suggest = 'suggest',
}

@Injectable()
export class BotService {
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

  getValidatedTelegramUserData(initDataString: string): UserDto {
    const params = new URLSearchParams(initDataString);
    const initData: { [key: string]: string } = {};
    params.forEach((value, key) => {
      initData[key] = value;
    });

    const receivedHash = initData.hash;
    if (!receivedHash) {
      throw new Error('Missing hash in initData.');
    }
    delete initData.hash;

    const dataCheckString = Object.keys(initData)
      .sort()
      .map((key) => `${key}=${initData[key]}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(process.env.BOT_TOKEN)
      .digest();

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (computedHash !== receivedHash) {
      throw new Error('Invalid signature: The data cannot be validated.');
    }

    if (!initData.user) {
      throw new Error('Missing user data in initData.');
    }

    try {
      return JSON.parse(initData.user);
    } catch (e) {
      console.error(e);
      throw new Error('Failed to parse user data.');
    }
  }
}
