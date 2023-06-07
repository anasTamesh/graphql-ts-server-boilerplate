import { startServer } from "../startServer";
import { AddressInfo } from "net";

export const setup =  async () => {
    const appConn = await startServer();
    const {port} = appConn.address() as AddressInfo;
    process.env.TEST_HOST = `http://127.0.0.1:${port}/graphql`;
    return appConn;
};