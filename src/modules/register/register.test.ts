import "reflect-metadata";
import { request } from 'graphql-request';
import { User } from '../../entity/User';
import { duplicateEmail, emailNotLongEnough, invalidEmail, passwordNotLongEnough } from "./errorMessages";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { DataSource } from "typeorm";

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
let conn: DataSource;

beforeAll( async () => {
  conn = await createTypeormConn();
});

afterAll( async () => {
  await conn.destroy();
});

describe('A register user', () => {
  it('Should register a valid user', async () => {
    // check if we can register a user
    const response = await request(process.env.TEST_HOST as string, mutation(email, password));
    expect(response).toEqual({register: null });

    const users = await User.find( { where: { email }});
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  it('should not register a duplicate user', async () => {
    // check for duplicate emails
    const response: any = await request(process.env.TEST_HOST as string, mutation(email, password));
    expect(response.register).toHaveLength(1);
    expect(response.register[0].path).toEqual("email")
    expect(response.register[0].message).toEqual(duplicateEmail);
  });
  
  it('should not register a user with an invalid email', async () => {
    // check for bad email
    const response: any = await request(process.env.TEST_HOST as string, mutation("em", password));
    expect(response.register).toHaveLength(2);
    expect(response.register).toEqual([
      {
        path: "email",
        message: emailNotLongEnough
      },
      {
        path: "email",
        message: invalidEmail
      }
    ]);
  });
  
  it('should not register a user with an invalid password', async () => {
    // check for bad password
    const response: any = await request(process.env.TEST_HOST as string, mutation(email, "pa"));
    expect(response.register).toHaveLength(1);
    expect(response.register).toEqual([
      {
        path: "password",
        message: passwordNotLongEnough
      }
    ]);
  }); 
  
  it('should not register a user with an invalid email and an invalid password', async () => {
    // check for bad email and bad password
    const response: any = await request(process.env.TEST_HOST as string, mutation("em", "pa"));
    expect(response.register).toHaveLength(3);
    expect(response.register).toEqual([
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
      },
    ]);
  });

});