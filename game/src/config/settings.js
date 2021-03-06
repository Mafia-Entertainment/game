const dotenv = require('dotenv');
dotenv.config();

console.log(`Your port is ${process.env.PORT}`);
console.log(`Mongo is ${process.env.MONGO_URL}`);

module.exports = {
    port: process.env.PORT,
    host: process.env.HOST,
    mongoUrl: process.env.MONGO_URL,
    userCountRoom: process.env.USER_COUNT_ROOM,
};