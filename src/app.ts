import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors'; 
import walletRoutes from './routes/walletRoutes';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();

app.use(cors()); 
app.use(express.json());

app.use('/api', walletRoutes);

export default app;
