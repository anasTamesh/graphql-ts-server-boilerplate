import * as path from 'path'
import * as fs from 'fs';
import { generateNamespace } from '@gql2ts/from-schema';
import { genSchema } from '../utils/genSchema';

const createTypes = async () => {
    const typescriptTypes = generateNamespace('GQL', await genSchema());
    fs.writeFile(path.join(__dirname,'../types/schema.d.ts'), typescriptTypes, (err) => console.log(err));
};

createTypes();