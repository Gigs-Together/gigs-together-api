export interface TelegramUserDto {
  id: number;
  first_name: string;
  is_bot?: boolean;
  username?: string;
  language_code?: string;

  [key: string]: unknown;
}

export interface UserDto {
  telegramUser: TelegramUserDto;
  isAdmin: boolean;
}
