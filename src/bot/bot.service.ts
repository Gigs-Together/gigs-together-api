import { Injectable } from '@nestjs/common';
import { MessageDto, SendMessageDto } from './dto/message.dto';
import axios from '../common/axios';

enum Command {
  Start = 'start',
}

@Injectable()
export class BotService {
  async sendMessage({ chatId, text }: SendMessageDto): Promise<void> {
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
      default: {
        await this.sendMessage({
          chatId,
          text: `Hey there, I don't know that command.`,
        });
      }
    }
  }
}
