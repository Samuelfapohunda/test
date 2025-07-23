import request from 'supertest';
import app from '../src/app'; // Ensure this path is correct

describe('User Registration Endpoint', () => {
  it('should register a user if not blacklisted', async () => {
    const response = await request(app).post('/api/users/register').send({
      email: `test${Date.now()}@mail.com`,
      phone: '08100000000',
      name: 'Test User',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });
});
