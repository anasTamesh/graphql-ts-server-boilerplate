import "reflect-metadata";
import { Redis } from "ioredis";
import { User } from "../entity/User";
import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { createTypeormConn } from "./createTypeormConn";
import fetch from "node-fetch";

let userId = "";
const redis = new Redis();

beforeAll(async () => {
    await createTypeormConn();
    const user = await User.create({
        email: "anasm4@gmail.com",
        password: "anasm4"
    }).save();
    userId = user.id;
});

describe("Test createConfirmEmailLink", () => {
    it("confirms user and clears key in redis", async () => {
        const url = await createConfirmEmailLink(process.env.TEST_HOST as string, userId, redis);
        const response = await fetch(url);
        const text = await response.text();
        expect(text).toEqual("ok");
        const user = await User.findOne({ where: { id: userId } });
        expect((user as User).confirmed).toBeTruthy();
    
        const urlChunks = url.split("/");
        const key = urlChunks[urlChunks.length - 1];
        const value = await redis.get(key);
        expect(value).toBeNull();
    });

});