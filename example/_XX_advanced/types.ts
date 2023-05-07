import { CtxHttp } from 'minimal2b/http';
import express from 'express';

export type AppReq = express.Request & {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type AppCtxHttp = CtxHttp & {
  req: AppReq;
};
