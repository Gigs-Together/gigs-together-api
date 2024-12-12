import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export async function up(): Promise<void> {
  await mongoose.connect(process.env.MONGO_URI);
}
