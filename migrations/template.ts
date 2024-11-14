import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI, MONGO_DB } = process.env;

const CONNECTION_URI = `${MONGO_URI}${MONGO_DB}`;

export async function up(): Promise<void> {

  await mongoose.connect(CONNECTION_URI);

}
