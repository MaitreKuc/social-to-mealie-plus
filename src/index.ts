import { html } from '@elysiajs/html';
import staticPlugin from '@elysiajs/static';
import { env } from '@yolk-oss/elysia-env';
import { Elysia, t } from 'elysia';
import processRecipe from './controller';
import { envElysia } from './types';

export const setEnv = new Elysia({ name: 'set-env' }).use(env(envElysia));

const app = new Elysia()
  .use(setEnv)
  .use(html())
  .use(staticPlugin())
  .post('/get-url', async ({ body, env }) => await processRecipe({ body, env }), {
    body: t.Object({
      url: t.String(),
    }),
  })
  .get('/', () => Bun.file('./public/index.html'))
  .listen(3000);

console.log(`Social media to mealie at ${app.server?.hostname}:${app.server?.port}`);
