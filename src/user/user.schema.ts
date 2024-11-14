import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop({ unique: true })
  telegramId: string;

  @Prop()
  isAdmin: string;
}

// export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
