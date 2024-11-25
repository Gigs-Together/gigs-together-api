import { UserDto } from '../../telegram/dto/user.dto';

export interface CreateGigDto {
  title: string;
  date: string;
  location: string;
  tickets: string;
  telegramUser: UserDto;
}
