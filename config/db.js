const mongoose = require('mongoose');
require('dotenv').config();
/**
 * Mongoose is an ODM(object data/document mapper) used for noSQL databases
 * For SQL dbs, e.g. Sequelize is used
 */
const connectDb = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    .then(conn => console.log(`mongoDb connected, ${conn.connection.host}`))
    .catch(err => console.log(err));
    
};

module.exports = {connectDb};