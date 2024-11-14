import mongoose from 'mongoose';
import { UserSchema } from '../src/user/user.schema';
import * as dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI, MONGO_DB } = process.env;
const { BOT_ADMINS } = process.env;

const CONNECTION_URI = `${MONGO_URI}${MONGO_DB}`;

const User = mongoose.model('User', UserSchema);

export async function up(): Promise<void> {
  const admins = JSON.parse(BOT_ADMINS);
  if (!admins) {
    throw new Error('BOT_ADMINS not found in process.env');
  }
  await mongoose.connect(CONNECTION_URI);
  const operations = Object.entries(admins).map(([username, id]) => ({
    updateOne: {
      filter: { telegramId: id }, // Filter by unique field
      update: {
        $setOnInsert: {
          telegramId: id,
          username,
          isAdmin: true,
        },
      }, // Use $setOnInsert to insert only if the document doesn't exist
      upsert: true, // Enables upsert: create if not found, otherwise no action
    },
  }));

  await User.bulkWrite(operations);
}
