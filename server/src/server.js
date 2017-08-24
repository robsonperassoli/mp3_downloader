import 'babel-polyfill'

import express from 'express'
import graphqlHTTP from 'express-graphql'
import schema from './graphql/schema'
import cors from 'cors'
import { createServer } from 'http'
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws'
import pubsub from './pubsub'

const app = express();

app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  graphiql: true
}));

const server = createServer(app);

new SubscriptionServer({ schema, execute, subscribe }, { server, path: '/subscriptions' });

setInterval(() => pubsub.publish('newMessage', 'MEssage dddddddd'), 5000)

server.listen(8000);
