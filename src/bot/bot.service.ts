import { Injectable } from '@nestjs/common';
import axios from '../common/axios';
import { Message } from './bot.types';

@Injectable()
export class BotService {
  private async sendMessage(chatId: string, text: string): Promise<void> {
    // Type definition for params as an object with specific properties
    const params: { chat_id: string; text: string } = { chat_id: chatId, text };

    await axios.get('sendMessage', { params });
  }

  async handleMessage(message: Message): Promise<void> {
    const messageText = message.text || '';
    const chatId = message.chat.id;

    if (messageText.charAt(0) === '/') {
      const command = messageText.substring(1);
      switch (command) {
        case 'start':
          await this.sendMessage(
            chatId,
            `Hi! I'm a bot. I can help you to get started!`,
          );
          break;
        default:
          await this.sendMessage(
            chatId,
            `Hey there, I don't know that command.`,
          );
      }
    } else {
      await this.sendMessage(chatId, `You said: "${messageText}"`);
    }
  }
}
