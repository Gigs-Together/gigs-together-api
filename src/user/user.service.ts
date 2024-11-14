import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UserService {
  private adminsCache: Promise<UserDocument[]>;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.refreshAdminsCache();
  }

  private async refreshAdminsCache(): Promise<void> {
    this.adminsCache = this.getAdmins();
    const admins = await this.adminsCache;
    console.log(`Admins cache refreshed: ${admins.length} admin(s) found.`);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleAdminsCacheSync(): Promise<void> {
    console.log('Refreshing admins cache from the database...');
    await this.refreshAdminsCache();
  }

  async getAdmins(): Promise<UserDocument[]> {
    return this.userModel.find({ isAdmin: true }).exec();
  }

  async isAdmin(telegramId: number): Promise<boolean> {
    const admins = await this.adminsCache;
    return admins.some((admin) => admin.telegramId === telegramId);
  }

  async findByTelegramId(telegramId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ telegramId }).exec();
  }
}
