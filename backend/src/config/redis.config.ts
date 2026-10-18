import { createClient } from "redis";


const redisClient = createClient({ url: process.env.REDIS_CONN_URL || 'redis://localhost:6379' });


// const configRedis = async () => {
//     try {
//         await redisClient.connect();
//         console.log('Redis connected');

//         // const stringKey = "username:1";
//         // await redis.set(stringKey, "vicky");

//         // const keyValue = await redis.get(stringKey);
//         // console.log('Redis key value: ', keyValue);

//         // const userHashKey = "user:profile";
//         // const userHashKeyField = {
//         //     name: 'Priya',
//         //     email: 'priya@protonmail.com'
//         // };

//         // await redis.hSet(userHashKey, userHashKeyField);

//         // const userProfile = await redis.hGetAll(userHashKey);
//         // const userEmail = await redis.hGet(userHashKey, 'email');

//         // console.log(`User details`, userProfile, `with email ${userEmail}`)


//     } catch (error) {
//         console.log(`REDIS_CONN_ERR ${error}`);
//     }
// }


redisClient.on('connect', () => {
    console.log("Redis client connected");
});

redisClient.on('ready', () => {
    console.log("Redis client is ready");
});

redisClient.on('error', (err) => {
    console.log('Error occured in redis client ', err);
});

redisClient.on('end', () => {
    console.log('Redis client ended');
});


const redisConnect = async (): Promise<void> => { 
    if(!redisClient.isOpen){
        await redisClient.connect();
    }
};

const disconnectRedis = async (): Promise<void> =>{
    if(redisClient.isOpen){
        await redisClient.quit();
    }
};

export default redisClient;

export {
    redisConnect,
    disconnectRedis,
}
