import { Queue } from "bullmq";


export const videoTranscodingQueue = new Queue(
  "video-transcoding",
  {
    connection: {
        host: "127.0.0.1",
        port:6379
    },

    defaultJobOptions: {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 5000,
      },

      removeOnComplete: {
        age: 3600,
        count: 1000,
      },

      removeOnFail: {
        age: 86400,
      },
    },
  }
);