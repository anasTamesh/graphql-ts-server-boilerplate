import { Redis } from "ioredis";
import { v4 } from "uuid";

export const createConfirmEmailLink = async (url: string, userId: string, redis: Redis) => {
    const id = v4();
    await redis.set(id, userId, "EX", 86400);
    return `${url}/confirm/${id}`;
};