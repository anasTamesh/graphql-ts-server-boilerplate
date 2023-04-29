import "reflect-metadata";
import { request } from 'graphql-request';
import { User } from '../../entity/User';
import { DataSource } from "typeorm";
import { startServer } from "../../startServer";
import { AddressInfo } from "net";
import { Server } from "net";

interface AppConn {
  app: Server;
  conn: DataSource;
}

let appConn: AppConn;
let getHost = () => "";

beforeAll( async () => {
  appConn = await startServer();
  const {port} = appConn.app.address() as AddressInfo;
  getHost = () => `http://127.0.0.1:${port}/graphql`;
})

const email = "anas@gmail.com";
const password = "anas";

const mutation = `
mutation{
    register(email:"${email}", password: "${password}") {
      path
      message
    }
  }
`;

test('Test register user', async () => {
    const response = await request(getHost(), mutation);
    expect(response).toEqual({register: null });

    const users = await User.find( { where: { email }});
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
    const response2: any = await request(getHost(), mutation);
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0].path).toEqual("email");

    // await appConn.conn.destroy();
});