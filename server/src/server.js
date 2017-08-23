import 'babel-polyfill'

import express from 'express'
import graphqlHTTP from 'express-graphql'
import schema from './graphql/schema'
import cors from 'cors'

const app = express();

app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(8000);
