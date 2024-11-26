import mongoose from 'mongoose';
import { AdminSchema } from '../src/schemas/admin.schema';
import * as dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI, MONGO_DB } = process.env;
const { BOT_ADMINS } = process.env;

const CONNECTION_URI = `${MONGO_URI}${MONGO_DB}`;

const Admin = mongoose.model('Admin', AdminSchema);

export async function up(): Promise<void> {
  const admins: { [key: string]: number } = JSON.parse(BOT_ADMINS);
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
          isActive: true,
        },
      }, // Use $setOnInsert to insert only if the document doesn't exist
      upsert: true, // Enables upsert: create if not found, otherwise no action
    },
  }));

  await Admin.bulkWrite(operations);
}
