import { UserDto } from '../../bot/dto/user.dto';

export interface CreateGigDto {
  title: string;
  date: string;
  location: string;
  tickets: string;
  telegramUser: UserDto;
}
