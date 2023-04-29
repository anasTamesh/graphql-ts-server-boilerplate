import * as path from 'path'
import { createYoga } from 'graphql-yoga'
// import { createSchema, createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'
import { createTypeormConn } from './utils/createTypeormConn'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers } from '@graphql-tools/merge'
// import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import {loadSchema} from '@graphql-tools/load'
import {GraphQLFileLoader} from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
// import { GraphQLSchema } from 'graphql'

export const startServer = async () => {
  // let schemas = loadFilesSync(path.join(__dirname, './**/schema.graphql'));
  // const shared = loadFilesSync(path.join(__dirname, './shared.graphql'));
  // schemas.forEach(sc => {
  //   shared.push(sc);
  // });
  // schemas = [shared[0], ...schemas]
  // schemas.push(shared[0]);
  // console.log('schemas');
  // console.log(schemas);
  const schema2 = await loadSchema(path.join(__dirname, './modules/**/schema.graphql'), {
    // load files and merge them into a single schema object
    loaders: [new GraphQLFileLoader()]
  })
  // console.log('schema2');
  // console.log(schema2);
  // const schema5 = await loadSchema('./src/**/*.graphql', { loaders: [new GraphQLFileLoader()] });
  
  // const typeDefs = mergeTypeDefs(schemas);
  // console.log('typeDefs');
  // console.log(typeDefs);
  const resolversArray = loadFilesSync(path.join(__dirname, './modules/**/resolvers.ts'));
  const resolvers = mergeResolvers(resolversArray);
  // console.log('resolvers');
  // console.log(resolvers);
  
  // const sc = createSchema({
  //   typeDefs,
  //   resolvers
  // });
  // console.log('sc');
  // console.log(sc);

  const sc2 = addResolversToSchema({
    schema: schema2,
    resolvers
  });
  // console.log('sc2');
  // console.log(sc2);
  // const yoga = createYoga({
  //   schema: addResolversToSchema({
  //     schema: schema2,
  //     resolvers
  //   })
  // });
  const yoga = createYoga({
    schema: sc2
  });
  
  const server = createServer(yoga);
  let port = process.env.NODE_ENV === 'test' ? 0 : 4000;
  const conn = await createTypeormConn(); 
  const app = server.listen({ port });
  console.info(`Server is running on http://localhost:${port}/graphql`);
  return {app,conn};
}
