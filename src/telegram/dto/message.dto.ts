import { TelegramUserDto } from './user.dto';
import { ChatDto } from './chat.dto';

export interface MessageDto {
  message_id: number;
  from?: TelegramUserDto;
  chat: ChatDto;
  text?: string; // UTF-8 text
  date: number;
  reply_to_message?: MessageDto;

  [key: string]: unknown;
}

export interface SendMessageDto {
  chatId: string | number;
  text: string;
}
