const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const { connectDb } = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); //to use env variable here in this file
const port = process.env.PORT || 5000;
// connect to db
connectDb();

const app = express();
app.use(cors({
    origin: '*',
}));
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: process.env.NODE_ENV === 'development',
}));

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, '../client/build')));
  // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});