# Minimal2b (v0.1.6)

### Description

```
Framework for making typescript backend apps
```

### Install

```sh
npm i minimal2b
# or
yarn add minimal2b
```

### Base app example

```typescript
import bodyParser from 'body-parser';
import { IsString } from 'class-validator';
import express from 'express';
import { defineApplication } from 'minimal2b/application';
import { Controller, Ctx, Get, Post, Route } from 'minimal2b/http';
import { Logger } from 'minimal2b/logger';
import { validateDto } from 'minimal2b/validator';

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
  byName(ctx: Ctx) {
    return `Hello, ${ctx.params['name']}!`;
  }

  @Post('')
  async helloByPost(ctx: Ctx) {
    const body = await validateDto(ctx.body, HelloDto);
    return `Hello, ${body.name}!`;
  }
}

const helloController = new HelloController();

const routes = [
  {
    path: '',
    controller: new HelloController(),
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
```

### More examples

https://github.com/artyom-silantiev/minimal2b/tree/master/example
