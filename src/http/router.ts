import express from 'express';
import { parseController } from './decorators';
import { createLogger } from '../logger';
import {
  CtxHandler,
  ExpHandler,
  Method,
  Route,
  RouteHandler,
  CtxHttp,
} from './types';
import { catchHttpException } from './exception';

const logger = createLogger('Router');

function getExpressRouterMethod(method: Method, expressRouter: express.Router) {
  let expressRouterMethod;

  if (method === 'USE') {
    expressRouterMethod = expressRouter.use;
  } else if (method === 'ALL') {
    expressRouterMethod = expressRouter.all;
  } else if (method === 'GET') {
    expressRouterMethod = expressRouter.get;
  } else if (method === 'HEAD') {
    expressRouterMethod = expressRouter.head;
  } else if (method === 'OPTIONS') {
    expressRouterMethod = expressRouter.options;
  } else if (method === 'PATCH') {
    expressRouterMethod = expressRouter.patch;
  } else if (method === 'POST') {
    expressRouterMethod = expressRouter.post;
  } else if (method === 'PUT') {
    expressRouterMethod = expressRouter.put;
  } else if (method === 'DELETE') {
    expressRouterMethod = expressRouter.delete;
  }

  return expressRouterMethod;
}

function useRouteHandlers(
  routeHandlers: RouteHandler[],
  expressRouter: express.Router,
  routePath: string
) {
  for (const routeHandler of routeHandlers) {
    useRouteHandler(routeHandler, expressRouter, routePath);
  }
}

function useRouteHandler(
  routeHandler: RouteHandler,
  expressRouter: express.Router,
  routePath: string
) {
  const expHandler: ExpHandler = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const ctx = new CtxHttp(req, res, next);

      for (const midd of routeHandler.controllerMiddlewares || []) {
        await midd(ctx);
      }
      for (const midd of routeHandler.middlewares || []) {
        await midd(ctx);
      }

      const resData = await (routeHandler.handler as CtxHandler)(ctx);

      if (typeof resData === 'undefined') {
        return;
      }
      if (typeof resData === 'string') {
        res.send(resData);
      } else {
        res.json(resData);
      }
    } catch (error) {
      next(error);
    }
  };

  useExpHandler(expHandler, routeHandler, expressRouter, routePath);
}

function useExpHandler(
  handler: ExpHandler,
  routeHandler: RouteHandler,
  expressRouter: express.Router,
  routePath: string
) {
  const expressMethod = getExpressRouterMethod(
    routeHandler.method,
    expressRouter
  );

  let path = '';
  if (routeHandler.path) {
    if (!routeHandler.path.startsWith('/') && routeHandler.path.length > 0) {
      routeHandler.path = '/' + routeHandler.path;
    }
    path = routeHandler.path;
  }

  if (routeHandler.method === 'USE') {
    expressMethod.apply(expressRouter, [handler]);
  } else {
    expressMethod.apply(expressRouter, [path, handler]);
  }

  logger.log(`${routeHandler.method} ${(routePath + path).replace('//', '/')}`);
}

function parseRoutes(
  app: express.Application | express.Router,
  routes: Route[],
  path: string = '',
  level: number = 0
) {
  for (const route of routes) {
    if (!route.path.startsWith('/')) {
      route.path = '/' + route.path;
    }

    const expressRouter = express.Router();

    const basePath = (path + route.path).replace('//', '/');
    logger.log(`RouterPath:"${basePath}", deep:${level}`);

    if (route.middlewares) {
      for (const middleware of route.middlewares) {
        useRouteHandler(
          {
            method: Method.USE,
            handler: middleware,
          },
          expressRouter,
          basePath
        );
      }
    }

    if (route.controller) {
      const routeHandlers = parseController(route.controller);
      if (routeHandlers) {
        useRouteHandlers(routeHandlers, expressRouter, basePath);
      }
    }

    if (route.controllers) {
      for (const controller of route.controllers) {
        const routeHandlers = parseController(controller);
        if (routeHandlers) {
          useRouteHandlers(routeHandlers, expressRouter, basePath);
        }
      }
    }

    if (route.subRoutes) {
      parseRoutes(expressRouter, route.subRoutes, basePath, level + 1);
    }

    if (route.static) {
      app.use(express.static(route.static.root));
      logger.log(`STATIC ${basePath} => ${route.static.root}`);
    }

    (app as any).use(basePath, expressRouter);
  }
}

/** @inernal */
export function initAppRouter(app: express.Application, routes: Route[]) {
  parseRoutes(app, routes, '', 0);
  app.use(catchHttpException);
}
