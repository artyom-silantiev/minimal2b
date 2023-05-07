import * as grpc from '@grpc/grpc-js';
import { validateDto } from '../validator';
import { Class } from '../types';

export class GrpcMetadata {
  private metadata = {} as {
    [key: string]: any;
  };

  constructor(metadata: grpc.Metadata) {
    this.metadata = metadata.getMap();
  }

  has(key: string) {
    return typeof this.metadata[key] !== 'undefined';
  }

  get(key: string) {
    return this.metadata[key];
  }

  set(key: string, value: any) {
    this.metadata[key] = value;
  }

  delete(key: string) {
    delete this.metadata[key];
  }
}

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
  public metadata: GrpcMetadata;

  get request() {
    return this.req.request;
  }

  constructor(public type: GrpcCallType, public req: any) {
    this.metadata = new GrpcMetadata(req.metadata);
  }

  async validateDto<T>(obj: any, Dto: Class<T>) {
    return validateDto(obj, Dto);
  }
}
