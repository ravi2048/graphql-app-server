const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const { connectDb } = require('./config/db');
const dotenv = require('dotenv');
dotenv.config(); //to use env variable here in this file
const port = process.env.PORT || 5000;
// connect to db
connectDb();

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: process.env.NODE_ENV === 'development',
}));

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});