import { Request, Response } from 'express';
import { createWallet } from '../src/controllers/walletController';

describe('createWallet', () => {
  it('should return 400 if user_id or currency is missing', async () => {
    const req = {
      body: {}
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    await createWallet(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Missing user_id or currency'
    });
  });
});
