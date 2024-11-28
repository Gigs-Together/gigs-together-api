import { UserDto } from '../../../common/dto/user.dto';

interface CreateGigDto {
  title: string;
  date: string;
  location: string;
  ticketsUrl: string;
}

export interface V1TelegramCreateGigRequestBody {
  gig: CreateGigDto;
  telegramInitDataString: string;
}

export interface V1TelegramCreateGigRequestBodyValidated {
  gig: CreateGigDto;
  user: UserDto;
}
