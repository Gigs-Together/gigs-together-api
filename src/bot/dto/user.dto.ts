export interface UserDto {
  id: number;
  is_bot: boolean;
  first_name: string;
  username?: string;
  language_code?: string;

  [key: string]: unknown;
}
