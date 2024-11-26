import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Admin {
  @Prop()
  username?: string;

  @Prop({ unique: true })
  telegramId: number;

  @Prop({ default: true })
  isActive: boolean;
}

export type AdminDocument = HydratedDocument<Admin>;
export const AdminSchema = SchemaFactory.createForClass(Admin);
