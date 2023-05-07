import {
  CtxHandler,
  CtxHttp,
  HttpException,
  HttpMiddlewares,
} from 'minimal2b/http';
import { AppUser, AppUserKey } from './types';

const authMiddleware: CtxHandler = (ctx: CtxHttp) => {
  console.log('authMiddleware');

  if (!ctx.headers.authorization) {
    throw new HttpException('403', 403);
  }

  ctx.set(AppUserKey, {
    id: '1337',
    name: 'User',
    email: 'user@this-app.io',
  } as AppUser);

  ctx.next();
};

export function AuthGuard() {
  return HttpMiddlewares([authMiddleware]);
}
