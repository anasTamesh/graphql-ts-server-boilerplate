import { AppDataSource } from "../data-source";

export const createTypeormConn =  async () => {
    return await AppDataSource.initialize();
}