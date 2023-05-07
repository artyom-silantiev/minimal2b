import express from 'express';
import { Class } from '../types';
import { validateDto } from '../validator';

export class CtxHttp {
  get params() {
    return this.req.params;
  }
  get body() {
    return this.req.body;
  }
  get query() {
    return this.req.query;
  }
  get headers() {
    return this.req.headers;
  }

  constructor(
    public req: express.Request,
    public res: express.Response,
    public next: express.NextFunction
  ) {}

  async validateDto<T>(obj: any, Dto: Class<T>) {
    return await validateDto<T>(obj, Dto);
  }
}

export type ExpHandler = (
  req: express.Request | any,
  res: express.Response,
  next: express.NextFunction
) => Promise<void> | void;

export type CtxHandler = (ctx: CtxHttp | any) => Promise<any> | any;

export type RouteHandler = {
  path?: string;
  method: Method;
  handler: CtxHandler;
  middlewares?: CtxHandler[];
  controllerMiddlewares?: CtxHandler[];
};

export type StaticOptions = {
  root: string;
};

export type Route = {
  path: string;

  middlewares?: CtxHandler[];

  controller?: any;
  controllers?: any[];

  subRoutes?: Route[];

  static?: StaticOptions;
};

export enum Method {
  USE = 'USE',
  ALL = 'ALL',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type HttpHandler = {
  method: Method;
  path: string;
  key: string | symbol;
};
