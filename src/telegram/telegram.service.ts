import { Injectable } from '@nestjs/common';
import axios from '../common/axios';
import { MessageDto, SendMessageDto } from './dto/message.dto';
import * as crypto from 'crypto';
import { User, UserDocument } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

enum Command {
  Start = 'start',
  Suggest = 'suggest',
}

@Injectable()
export class TelegramService {
  private adminsCache: Promise<UserDocument[]>;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.refreshAdminsCache();
  }

  private async refreshAdminsCache(): Promise<void> {
    this.adminsCache = this.getAdmins();
    const admins = await this.adminsCache;
    console.log(`Admins cache refreshed: ${admins.length} admin(s) found.`);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleAdminsCacheSync(): Promise<void> {
    console.log('Refreshing admins cache from the database...');
    await this.refreshAdminsCache();
  }

  async getAdmins(): Promise<UserDocument[]> {
    return this.userModel.find({ isAdmin: true }).exec();
  }

  async isAdmin(telegramId: number): Promise<boolean> {
    const admins = await this.adminsCache;
    return admins.some((admin) => admin.telegramId === telegramId);
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
