// import { DataSource } from "typeorm";
// import { DataSource } from "typeorm";
import { AppDataSource, AppTestDataSource } from "../data-source";

export const createTypeormConn =  async () => {
    const connType = process.env.NODE_ENV?.trim();
    console.log(connType?.trim() + '-');
    if (connType == "test"){
        console.log(connType);
        return await AppTestDataSource.initialize();
    } 
    else if (connType == "development"){
        return await AppDataSource.initialize();
    } else {
        return await AppDataSource.initialize();
    }
}