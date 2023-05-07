import * as grpc from '@grpc/grpc-js';
import { validateDto } from '../validator';
import { Class } from '../types';

export type GrpcMiddleware = {
  (ctxGrpc: CtxGrpc): void;
};
export type GrpcCallHandler = {
  (ctxGrpc: CtxGrpc): any | Promise<any>;
};

export type GrpcServiceMeta = {
  serviceName: string;
  protoFile: string;
};

export enum GrpcCallType {
  Method = 0,
  StreamMethod = 1,
  StreamCall = 2,
}
export type GRPCall = {
  callName: string;
  type: GrpcCallType;
  key: string | symbol;
  middlewares?: GrpcMiddleware[];
};

export class CtxGrpc {
  private customData: Map<string | symbol, any>;
  public metadata: grpc.Metadata;

  get request() {
    return this.req.request;
  }

  constructor(public type: GrpcCallType, public req: any) {
    this.metadata = req.metadata;
  }

  async validateDto<T>(obj: any, Dto: Class<T>) {
    return validateDto(obj, Dto, this.customData);
  }

  set(key: string | symbol, value: any) {
    if (!this.customData) {
      this.customData = new Map<string | symbol, any>();
    }
    this.customData.set(key, value);
  }
  get(key: string | symbol) {
    if (!this.customData) {
      return null;
    }
    return this.customData.get(key);
  }
  del(key: string | symbol) {
    if (!this.customData) {
      return;
    }
    this.customData.delete(key);
  }
}
