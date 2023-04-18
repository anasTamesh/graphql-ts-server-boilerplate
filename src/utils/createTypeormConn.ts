import { AppDataSource } from "../data-source";

export const createTypeormConn =  async () => {
    // const connType = process.env.NODE_ENV;
    // if (connType == "test"){
    //     return await AppTestDataSource.initialize();
    // } 
    // else if (connType == "development"){
    //     return await AppDataSource.initialize();
    // } else {
    //     return await AppDataSource.initialize();
    // }
    return await AppDataSource.initialize();
}