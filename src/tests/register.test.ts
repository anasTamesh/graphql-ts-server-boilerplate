import "reflect-metadata";
import { request } from 'graphql-request';
import { host } from './constants';
import { User } from '../entity/User';
import { createTypeormConn } from "../utils/createTypeormConn";
import { DataSource } from "typeorm";

let dataSource : DataSource;

beforeAll( async () => {
  dataSource  = await createTypeormConn();
})

const email = "anas@gmail.com";
const password = "anas";

const mutation = `
mutation{
    register(email:"${email}", password: "${password}")
  }
`;

test('Test register user', async () => {
    const response = await request(host, mutation);
    expect(response).toEqual({register: true});

    const users = await User.find( { where: { email }});
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
    await dataSource.destroy();

});