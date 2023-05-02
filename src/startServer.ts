import * as path from 'path'
import { createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'
import { createTypeormConn } from './utils/createTypeormConn'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers } from '@graphql-tools/merge'
import {loadSchema} from '@graphql-tools/load'
import {GraphQLFileLoader} from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'

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

  const yoga = createYoga({
    schema
  });
  
  const server = createServer(yoga);
  let port = process.env.NODE_ENV === 'test' ? 0 : 4000;
  const conn = await createTypeormConn(); 
  const app = server.listen({ port });
  console.info(`Server is running on http://localhost:${port}/graphql`);
  return {app,conn};
}
