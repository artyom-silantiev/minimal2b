import { Route } from '@src/http';
import { AppModule } from './app.module';

export default [
  {
    path: 'api',
    controller: AppModule.appController,
  },
  {
    path: '',
    static: {
      root: process.cwd() + '/public',
    },
  },
] as Route[];
