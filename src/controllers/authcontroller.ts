import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import knex from '../db/knexInstance';
import axios from 'axios';

// ✅ Blacklist check via Karma
const checkUserBlacklist = async (email: string): Promise<boolean> => {
  try {
    const response = await axios.get('https://api.karma.lendsqr.com/api/v1/blacklist', {
      params: { email },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'Authorization': `Bearer YOUR_API_KEY` // optional
      },
    });

    return response.data?.isBlacklisted || false;
  } catch (error: any) {
    console.error('❌ Karma API Error:', error?.response?.data || error.message);
    throw new Error('Failed to verify blacklist status');
  }
};


export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const isBlacklisted = await checkUserBlacklist(email);
    if (isBlacklisted) {
      return res.status(403).json({ error: 'User is blacklisted' });
    }

    const existingUser = await knex('users').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await knex('users')
      .insert({ name, email, password: hashedPassword })
      .returning(['id', 'name', 'email']);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await knex('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
