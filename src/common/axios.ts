import axios from 'axios';

const BASE_URL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

export const instance = axios.create({
  baseURL: BASE_URL,
});

export default instance;
