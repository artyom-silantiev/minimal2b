export const modules = [] as ModuleWrap<unknown>[];
import express from 'express';
import { initAppRouter } from './http/router';
import { Route } from './http/types';

function addAppModule<T>(moduleWrap: ModuleWrap<T>) {
  modules.push(moduleWrap);
}

type LifecycleHandler = () => Promise<void> | void;
type ModuleMeta = {
  items: any[];
  initHandler: LifecycleHandler | null;
  destroyHandler: LifecycleHandler | null;
};
export type ModuleWrap<T> = {
  id: number;
  meta: ModuleMeta;
  module: T;
};

// module
function getModuleSetupCtx(meta: ModuleMeta) {
  return {
    useItems<T extends Object>(publicItems: T, privateItems?: any[]) {
      for (const item of Object.values(publicItems)) {
        meta.items.push(item);
      }
      if (privateItems) {
        for (const item of privateItems) {
          meta.items.push(item);
        }
      }
      return publicItems;
    },
    onModuleInit(handler: LifecycleHandler) {
      meta.initHandler = handler;
    },
    onModuleDestroy(handler: LifecycleHandler) {
      meta.destroyHandler = handler;
    },
  };
}
type ModuleSetupCtx = ReturnType<typeof getModuleSetupCtx>;
export type ModuleSetup<T> = (ctx: ModuleSetupCtx) => T;

// app module
function getAppModuleSetupCtx(meta: ModuleMeta) {
  return {
    ...getModuleSetupCtx(meta),
    ...{
      initHttpRoutes: (app: express.Application, routes: Route[]) => {
        initAppRouter(app, routes);
      },
    },
  };
}
type AppModuleSetupCtx = ReturnType<typeof getAppModuleSetupCtx>;
export type AppModuleSetup<T> = (ctx: AppModuleSetupCtx) => T;

// define module
let modulesCount = 0;

function __defineModule<T>(
  appModule: boolean,
  setup: ModuleSetup<T> | AppModuleSetup<T>
) {
  const moduleId = modulesCount++;

  const meta = {
    items: [] as any[],
    initHandler: null as null | { (): Promise<void> },
    destroyHandler: null as null | { (): Promise<void> },
  } as ModuleMeta;

  let moduleCtx!: ModuleSetupCtx | AppModuleSetupCtx;
  if (appModule) {
    moduleCtx = getAppModuleSetupCtx(meta);
  } else {
    moduleCtx = getModuleSetupCtx(meta);
  }

  const moduleWrap = {
    id: moduleId,
    meta,
    module: setup(moduleCtx as any),
  } as ModuleWrap<T>;

  addAppModule(moduleWrap);

  return moduleWrap.module;
}

export function defineModule<T>(setup: ModuleSetup<T>) {
  return __defineModule(false, setup);
}

/** @internal */
export function __defineAppModule<T>(setup: AppModuleSetup<T>) {
  return __defineModule(true, setup);
}
