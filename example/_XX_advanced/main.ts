import bodyParser from 'body-parser';
import { createAppLogger } from 'example-lib/app_logger';
import { useEnv } from '@elib/env/env';
import routes from './routes';
import express from 'express';
import { defineApplication } from 'minimal2b/application';

const logger = createAppLogger('App');

const application = defineApplication((ctx) => {
  const env = useEnv();
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  ctx.initHttpRoutes(app, routes);

  ctx.onModuleInit(() => {
    app.listen(env.NODE_PORT, () => {
      logger.debug('dev env used');
      logger.log('env: ', env);
      logger.log(`app listen port: ${env.NODE_PORT}`);
    });
  });

  ctx.onModuleDestroy(async () => {
    console.log('onModuleDestroy');
  });
});

application.run();
