import "reflect-metadata";
import { request } from 'graphql-request';
import { host } from './constants';
// import { AppTestDataSource } from '../data-source';
import { User } from '../entity/User';
import { createTypeormConn } from "../utils/createTypeormConn";
import { DataSource } from "typeorm";

let dataSource : DataSource;
beforeAll( async () => {
  // dataSource = await AppTestDataSource.initialize();
  // await AppTestDataSource.initialize();
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
    
    // const dataSource = await AppDataSource.initialize();
    // const userRepository = dataSource.getRepository(User);
    // const users = await userRepository.find( { where: { email }});
    const users = await User.find( { where: { email }});

    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
    await dataSource.destroy();

});