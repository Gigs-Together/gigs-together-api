import * as dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI, MONGO_DB } = process.env;

export default {
  uri: `${MONGO_URI}${MONGO_DB}`,
  templatePath: './migrations/template.ts',
};
