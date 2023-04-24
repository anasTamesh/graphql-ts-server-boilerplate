import * as path from 'path'
import { createSchema, createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'
import { createTypeormConn } from './utils/createTypeormConn'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'

export const startServer = async () => {
  const schemas = loadFilesSync(path.join(__dirname, './modules/**/schema.graphql'));
  const typeDefs = mergeTypeDefs(schemas);
  const resolversArray = loadFilesSync(path.join(__dirname, './modules/**/resolvers.ts'));
  const resolvers = mergeResolvers(resolversArray);
  
  const yoga = createYoga({
    schema: createSchema({
      typeDefs,
      resolvers
    })
  });
  
  const server = createServer(yoga);
  let port = process.env.NODE_ENV === 'test' ? 0 : 4000;
  const conn = await createTypeormConn(); 
  const app = server.listen({ port });
  console.info(`Server is running on http://localhost:${port}/graphql`);
  return {app,conn};
}
