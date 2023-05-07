import { IsString, MinLength } from 'class-validator';
import { AppCtxHttp } from './types';
import { AuthGuard } from './http.guards';
import { Controller, CtxHttp, Get, HttpException, Post } from 'minimal2b/http';

export class LoginDto {
  @IsString()
  @MinLength(5)
  login: string;

  @IsString()
  password: string;
}

@Controller()
export class AppController {
  @Get()
  index(ctx: CtxHttp) {
    if (ctx.query['name']) {
      return `Hello, ${ctx.query['name']}!`;
    } else {
      return 'Hello, world!';
    }
  }

  @Get('by_name/:name')
  byName(ctx: CtxHttp) {
    return `Hello, ${ctx.params.name}!`;
  }

  @Get('throw')
  getThrow(ctx: CtxHttp) {
    throw new HttpException(
      {
        badError: 'WTF!',
        status: 'emmm... mb 400?!',
      },
      400
    );
  }

  @Post('login')
  async login(ctx: CtxHttp) {
    const body = await ctx.validateDto(ctx.body, LoginDto);

    console.log('body', body);

    return {
      accessToken: (Math.random() * 1e6 + 1e6).toString(32),
    };
  }

  @Get('user/profile')
  @AuthGuard()
  getProfile(ctx: AppCtxHttp) {
    const user = ctx.req.user;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
