import { UserDto } from '../../telegram/dto/user.dto';

export interface SubmitGigDto {
  title: string;
  date: string;
  location: string;
  ticketsUrl: string;
  user: UserDto;
}

export interface GigDto {
  title: string;
  date: number;
  location: string;
  ticketsUrl: string;
}
