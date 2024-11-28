import { Injectable } from '@nestjs/common';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AuthService {
  private adminsCache: Promise<AdminDocument[]>;

  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {
    this.refreshAdminsCache();
  }

  private async refreshAdminsCache(): Promise<void> {
    this.adminsCache = this.adminModel.find({ isActive: true }).exec();
    const admins = await this.adminsCache;
    console.log(`Admins cache refreshed: ${admins.length} admin(s) found.`);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleAdminsCacheSync(): Promise<void> {
    console.log('Refreshing admins cache from the database...');
    await this.refreshAdminsCache();
  }

  async isAdmin(telegramId: number): Promise<boolean> {
    const admins = await this.adminsCache;
    return admins.some((admin) => admin.telegramId === telegramId);
  }
}
