import { Route } from 'minimal2b/http/types';
import { defineModule } from 'minimal2b/module';
import { HelloModule } from './hello.module';

export const AppModule = defineModule((ctx) => {
  const routes = [
    {
      path: '',
      controller: HelloModule.helloController,
    },
  ] as Route[];

  return {
    routes,
  };
});
