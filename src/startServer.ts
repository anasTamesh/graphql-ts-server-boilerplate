import { createYoga } from 'graphql-yoga'
import { createTypeormConn } from './utils/createTypeormConn'
import express = require('express')
import { redis } from './redis'
import { confirmEmail } from './routes/confirmEmail'
import { genSchema } from './utils/genSchema'

export const startServer = async () => {
  const yoga = createYoga({
    schema: await genSchema(),
    context: request => {
      const U: URL = new URL( request.request.url);
      return {
        redis,
        url: U.protocol + "//" + U.host
      }
    }
  });
  
  const server = express();
  server.use(yoga.graphqlEndpoint, yoga);
  server.get('/confirm/:id', confirmEmail);
  
  let port = process.env.NODE_ENV === 'test' ? 0 : 4000;
  await createTypeormConn(); 
  const app = server.listen({ port });
  console.info(`Server is running on http://localhost:${port}/graphql`);
  return app;
}
