import { startServer } from "../startServer";
// import { DataSource } from "typeorm";
// import { Server } from "net";
import { AddressInfo } from "net";

// interface AppConn {
//     app: Server;
//     conn: DataSource;
// };
  
// let appConn: AppConn;

export const setup =  async () => {
    const appConn = await startServer();
    const {port} = appConn.address() as AddressInfo;
    process.env.TEST_HOST = `http://127.0.0.1:${port}/graphql`;
    return appConn;
};