import { IsString } from 'class-validator';
import { defineModule } from 'minimal2b/module';
import { Controller, CtxHttp, Get, Post } from 'minimal2b/http';
import { Logger } from 'minimal2b/logger';

class HelloService {
  constructor(private logger: Logger) {}

  onModuleInit() {
    this.logger.log('HelloService is init');
  }

  getHelloMessage(name: string) {
    return `Hello, ${name}!`;
  }
}

class HelloDto {
  @IsString()
  name: string;
}

@Controller()
class HelloController {
  constructor(private logger: Logger, private helloService: HelloService) {}

  onModuleInit() {
    this.logger.log('HelloController is init!');
  }

  @Get('')
  index() {
    return this.helloService.getHelloMessage('World');
  }

  @Get('by_name/:name')
  byName(ctx: CtxHttp) {
    return this.helloService.getHelloMessage(ctx.params['name']);
  }

  @Post('')
  async helloByPost(ctx: CtxHttp) {
    const body = await ctx.validateDto(ctx.body, HelloDto);
    return this.helloService.getHelloMessage(body.name);
  }
}

export const HelloModule = defineModule((ctx) => {
  const moduleLogger = new Logger('HelloModule');
  const helloService = new HelloService(moduleLogger);
  const helloController = new HelloController(moduleLogger, helloService);

  return ctx.useItems(
    {
      helloController,
    },
    [helloService]
  );
});
