// import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
// import { loadSchemaSync } from '@graphql-tools/load'
import { createSchema, createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'
// import { join } from 'node:path'
// import {resolvers} from './resolvers'
import { createTypeormConn } from './utils/createTypeormConn'
// import path = require('node:path')
import path = require('path')
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'

export const startServer = async () => {
  // const schema = loadSchemaSync(join(__dirname, 'schema.graphql'), { loaders: [new GraphQLFileLoader()] });
  const schemas = loadFilesSync(path.join(__dirname, './modules/**/schema.graphql'));
  const typeDefs = mergeTypeDefs(schemas);
  const resolversArray = loadFilesSync(path.join(__dirname, './modules/**/resolvers.ts'));
  const resolverss = mergeResolvers(resolversArray);
  

  
  // const yoga = createYoga({
  //   schema: createSchema({
  //     typeDefs: schema,
  //     resolvers
  //   })
  // });
  const yoga = createYoga({
    schema: createSchema({
      typeDefs: typeDefs,
      resolvers: resolverss
    })
  });
  
  const server = createServer(yoga);
  let port = process.env.NODE_ENV === 'test' ? 0 : 4000;
  const conn = await createTypeormConn(); 
  const app = server.listen({ port });
  console.info(`Server is running on http://localhost:${port}/graphql`);
  return {app,conn};
}
