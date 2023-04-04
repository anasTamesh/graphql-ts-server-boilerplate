import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { createSchema, createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'
import { join } from 'node:path'
import {resolvers} from './resolvers'

const schema = loadSchemaSync(join(__dirname, 'schema.graphql'), { loaders: [new GraphQLFileLoader()] })

const yoga = createYoga({
  schema: createSchema({
    typeDefs: schema,
    resolvers: resolvers
  })
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})
