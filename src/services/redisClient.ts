import redis from "redis";
import {promisify} from "util"

const client = redis.createClient({
    host:'127.0.0.1',
    port:6379
} as redis.RedisClientOptions);

const GET_AYSNC = promisify(client.get).bind(client)
const SET_AYSNC = promisify(client.set).bind(client)

export {GET_AYSNC,SET_AYSNC}