import bodyParser from 'body-parser';
import { IsString } from 'class-validator';
import express from 'express';
import { defineApplication } from 'minimal2b/application';
import { Controller, CtxHttp, Get, Post, Route } from 'minimal2b/http';
import { Logger } from 'minimal2b/logger';

const PORT = 3000;

class HelloDto {
  @IsString()
  name: string;
}

@Controller()
class HelloController {
  @Get('')
  index() {
    return 'Hello, world!';
  }

  @Get('by_name/:name')
  byName(ctx: CtxHttp) {
    return `Hello, ${ctx.params['name']}!`;
  }

  @Post('')
  async helloByPost(ctx: CtxHttp) {
    const body = await ctx.validateDto(ctx.body, HelloDto);
    return `Hello, ${body.name}!`;
  }
}

const helloController = new HelloController();

const routes = [
  {
    path: '',
    controller: helloController,
  },
] as Route[];

defineApplication((ctx) => {
  const logger = new Logger('App');
  const app = express();

  logger.debug('App irunning...');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  ctx.initHttpRoutes(app, routes);

  ctx.onModuleInit(() => {
    app.listen(PORT, () => {
      logger.log(`app listen port: ${PORT}`);
    });
  });
}).run();
