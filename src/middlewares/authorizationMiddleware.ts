import { Request, Response, NextFunction } from 'express';
import UserRepostory from '../user/user.repository';
import { dynamoDbClient } from '../db/dbClient';
import UserService from '../user/user.service';

export async function authorizationMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path === '/login') next();

  const userSessionToken = req.cookies?.userSessionToken;
  const userEmail = req.cookies?.userEmail;

  const userRepository = new UserRepostory(dynamoDbClient, 'expenses-test');
  const userService = new UserService(userRepository);

  const isUserAuthentic = userEmail && userSessionToken && await userService.isUserAuthentic({
    email: userEmail,
    userSessionToken
  });

  console.log(`userSessionToken: ${JSON.stringify(userSessionToken)}`);
  console.log(`userEmail: ${JSON.stringify(userEmail)}`);

  if (!isUserAuthentic) {
    res.status(401).send();
  } else {
    next();
  }
}