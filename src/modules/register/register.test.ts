import "reflect-metadata";
import { request } from 'graphql-request';
import { User } from '../../entity/User';
import { DataSource } from "typeorm";
import { startServer } from "../../startServer";
import { AddressInfo } from "net";
import { Server } from "net";
import { duplicateEmail, emailNotLongEnough, invalidEmail, passwordNotLongEnough } from "./errorMessages";

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

const mutation = (e: string, p: string) => `
mutation{
    register(email:"${e}", password: "${p}") {
      path
      message
    }
  }
`;

test('Test register user', async () => {
  // check if we can register a user
    const response = await request(getHost(), mutation(email, password));
    expect(response).toEqual({register: null });

    const users = await User.find( { where: { email }});
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    // check for duplicate emails
    const response2: any = await request(getHost(), mutation(email, password));
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0]).toEqual({
      path: "email",
      message: duplicateEmail
    });
    
    // check for bad email
    const response3: any = await request(getHost(), mutation("em", password));
    expect(response3).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        {
          path: "email",
          message: invalidEmail
        }
      ]
    });
    
    // check for bad password
    const response4: any = await request(getHost(), mutation(email, "pa"));
    expect(response4).toEqual({
      register: [
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
    
    // check for bad email and bad password
    const response5: any = await request(getHost(), mutation("em", "pa"));
    expect(response5).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        {
          path: "email",
          message: invalidEmail
        },
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
});