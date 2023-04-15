import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
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
})
export const AppTestDataSource = new DataSource({
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
})
