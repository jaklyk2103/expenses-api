import { NextFunction } from 'express';
import * from 'cookie-parser';

export function authorizationMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies; 
}