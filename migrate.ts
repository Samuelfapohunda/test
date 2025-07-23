import * as dotenv from 'dotenv';
import path from 'path';

// 👇 Make sure the path is pointing to the root .env
dotenv.config(); // No path — defaults to root


console.log('ENV Loaded:', {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD
});
