import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import { User } from "./entity/User"

const connType = process.env.NODE_ENV;


const prodDataSource: DataSourceOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "123",
    database: "graphql-ts-server-boilerplate",
    synchronize: true,
    logging: true,
    entities: [User],
    migrations: [],
    subscribers: [],
};

const testDataSource: DataSourceOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "123",
    database: "graphql-ts-server-boilerplate-test",
    synchronize: true,
    logging: false,
    dropSchema: true, 
    entities: [User],
    migrations: [],
    subscribers: [],
};

export const AppDataSource = new DataSource(connType === 'test' ? testDataSource : prodDataSource);
