const Koa = require('koa');
const Router = require('koa-router');
const body = require('koa-body');

const server = new Koa();
const router = new Router();

const users = {
  0: {
    username: 'Lol',
    email: 'lol@example.com',
  },
  1: {
    username: 'Foo',
    email: 'foo@example.com',
  },
  2: {
    username: 'Bar',
    email: 'bar@example.com',
  },
};

router
  .get('/users', ctx => {
    ctx.body = Object.values(users);
  })
  .post('/users', ctx => {
    const { username, email } = ctx.request.body;
    const lastId = Object.keys(users)[Object.keys(users).length - 1];
    ctx.body = users[+lastId + 1] = { username, email };
  })
  .get('/user/:id', ctx => {
    ctx.body = users[ctx.params.id] || 'User not found';
  })
  .patch('/user/:id', ctx => {
    const { username, email } = ctx.request.body;
    const { id } = ctx.params;
    ctx.body = !users[id] ? 'User not found' :
      users[id] = {
        username: username || users[id].username,
        email: email || users[id].email,
      }
  })
  .delete('/user/:id', ctx => {
    if (!users[id]) {
      ctx.body = 'User not found';
    } else {
      const { username } = users[ctx.params.id];
      delete users[ctx.params.id];
      ctx.body = `User ${username} was deleted`;
    }
  })

server
  .use(body())
  .use(router.allowedMethods())
  .use(router.routes());

server.listen(5000);