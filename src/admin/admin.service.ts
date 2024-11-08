import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  private admins: string[];

  constructor(private configService: ConfigService) {
    const admins = this.configService.get<string>('BOT_ADMINS');
    this.admins = admins ? admins.split(',') : [];
  }

  isAdmin(userId: string): boolean {
    return this.admins.includes(String(userId));
  }
}
