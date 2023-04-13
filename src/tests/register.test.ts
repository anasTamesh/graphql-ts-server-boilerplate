import "reflect-metadata";
import { request } from 'graphql-request';
import { host } from './constants';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
// import { AppD } from "..";
// import { createConnection } from 'typeorm';

const email = "anas8@gmail.com";
const password = "anas8";

const mutation = `
mutation{
    register(email:"${email}", password: "${password}")
  }
`;

test('Test register user', async () => {
    const response = await request(host, mutation);
    expect(response).toEqual({register: true});
    
    const dataSource = await AppDataSource.initialize();
    // const dataSource = AppD;
    // const dataSource = await AppD.initialize();
    const userRepository = dataSource.getRepository(User);
    // const users = await userRepository.find();
    const users = await userRepository.find( { where: { email }});
    // console.log("All photos from the db: ", users)

    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
    await dataSource.destroy();

});