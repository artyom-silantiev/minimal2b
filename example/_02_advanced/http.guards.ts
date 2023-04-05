import { CtxHandler, HttpException, HttpMiddlewares } from 'minimal2b/http';
import { AppCtx } from './types';

const authMiddleware: CtxHandler = (ctx: AppCtx) => {
  console.log('authMiddleware');

  if (!ctx.headers.authorization) {
    throw new HttpException('403', 403);
  }

  ctx.req.user = {
    id: '1337',
    name: 'User',
    email: 'user@this-app.io',
  };

  ctx.next();
};

export function AuthGuard() {
  return HttpMiddlewares([authMiddleware]);
}
