const Bull = require("bull");

const cancelOrderQueue = new Bull("cancelOrder", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
});

module.exports = { cancelOrderQueue };
