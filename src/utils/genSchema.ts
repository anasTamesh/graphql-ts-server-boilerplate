import * as path from 'path'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers } from '@graphql-tools/merge'
import {loadSchema} from '@graphql-tools/load'
import {GraphQLFileLoader} from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'

export const genSchema = async () => {
    const schemas = await loadSchema(path.join(__dirname, '../modules/**/schema.graphql'), {
        loaders: [new GraphQLFileLoader()]
      });
    
    const resolversArray = loadFilesSync(path.join(__dirname, '../modules/**/resolvers.ts'));
    const resolvers = mergeResolvers(resolversArray);
    
    const schema = addResolversToSchema({
        schema: schemas,
        resolvers
    });    

    return schema;
}



