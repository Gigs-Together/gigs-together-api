import { UserDto } from './user.dto';
import { ChatDto } from './chat.dto';

export interface MessageDto {
  message_id: number;
  from?: UserDto;
  chat: ChatDto;
  text?: string; // UTF-8 text
  date: number;
  reply_to_message?: MessageDto;

  [key: string]: unknown;
}
