import "reflect-metadata";
import { request } from 'graphql-request';
// import { host } from './constants';
import { User } from '../entity/User';
// import { createTypeormConn } from "../utils/createTypeormConn";
import { DataSource } from "typeorm";
import { startServer } from "../startServer";
import { AddressInfo } from "net";
import { Server } from "net";
// import { AppDataSource } from "../data-source";

// let dataSource : DataSource;
interface AppConn {
  app: Server;
  conn: DataSource;
}
let appConn: AppConn;
let getHost = () => "";

beforeAll( async () => {
  // dataSource  = await createTypeormConn();
  appConn = await startServer();
  const {port} = appConn.app.address() as AddressInfo;
  getHost = () => `http://127.0.0.1:${port}/graphql`;
})

const email = "anas@gmail.com";
const password = "anas";

const mutation = `
mutation{
    register(email:"${email}", password: "${password}")
  }
`;

test('Test register user', async () => {
    const response = await request(getHost(), mutation);
    expect(response).toEqual({register: true});

    const users = await User.find( { where: { email }});
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
    // await dataSource.destroy();
    await appConn.conn.destroy();

});