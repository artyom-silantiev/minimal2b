import bodyParser from 'body-parser';
import { AppModule } from 'example/_02_modules/app.module';
import express from 'express';
import { defineApplication } from 'minimal2b/application';
import { Logger } from 'minimal2b/logger';
import { CronModule } from './crom.module';

const PORT = 3000;

defineApplication((ctx) => {
  const logger = new Logger('App');
  const app = express();

  logger.debug('App irunning...');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  ctx.initHttpRoutes(app, AppModule.routes);

  // used modules
  CronModule;

  ctx.onModuleInit(() => {
    app.listen(PORT, () => {
      logger.log(`app listen port: ${PORT}`);
    });
  });
}).run();
