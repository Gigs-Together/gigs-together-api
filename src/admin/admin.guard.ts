import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly adminService: AdminService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.body?.message?.from?.id; // TODO: chaining

    if (!userId) {
      throw new ForbiddenException('User ID is required in the message.');
    }

    if (!this.adminService.isAdmin(userId)) {
      // TODO: should we keep track of users who tried accessing the bot?
      throw new ForbiddenException('Access denied. Admin privileges required.');
    }

    return true;
  }
}
