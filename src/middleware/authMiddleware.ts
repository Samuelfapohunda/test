import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const fakeAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  req.user = {
    id: 1,
    email: 'testuser@example.com',
  };
  next();
};
