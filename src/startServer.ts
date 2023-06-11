import * as path from 'path'
import { createYoga } from 'graphql-yoga'
import { createTypeormConn } from './utils/createTypeormConn'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers } from '@graphql-tools/merge'
import {loadSchema} from '@graphql-tools/load'
import {GraphQLFileLoader} from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import  Redis  from 'ioredis'
import express = require('express')
import { User } from './entity/User'

export const startServer = async () => {
  const schemas = await loadSchema(path.join(__dirname, './modules/**/schema.graphql'), {
    loaders: [new GraphQLFileLoader()]
  });

  const resolversArray = loadFilesSync(path.join(__dirname, './modules/**/resolvers.ts'));
  const resolvers = mergeResolvers(resolversArray);

  const schema = addResolversToSchema({
    schema: schemas,
    resolvers
  });
  
  const redis = new Redis();

  const yoga = createYoga({
    schema,
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
  server.get('/confirm/:id', async (req, res) => {
    const { id } = req.params;
    const userId = await redis.get(id) as string;
    if (userId) {
      await User.update({ id: userId }, { confirmed: true });
      await redis.del(id);
      res.send("ok");
    } else {
      res.send("invalid");
    }
  });
  
  let port = process.env.NODE_ENV === 'test' ? 0 : 4000;
  await createTypeormConn(); 
  const app = server.listen({ port });
  console.info(`Server is running on http://localhost:${port}/graphql`);
  return app;
}
