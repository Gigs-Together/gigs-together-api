export interface UserDto {
  id: number;
  first_name: string;
  is_bot?: boolean;
  username?: string;
  language_code?: string;

  [key: string]: unknown;
}
