import 'babel-polyfill'

import express from 'express'
import graphqlHTTP from 'express-graphql'
import { makeExecutableSchema } from 'graphql-tools';
import { SubscriptionServer } from 'subscriptions-transport-ws'
import cors from 'cors'
import { createServer } from 'http'
import { execute, subscribe } from 'graphql';
import typeDefs from './graphql/types'
import resolvers from './graphql/resolvers'
import pubsub from './graphql/pubsub'

const app = express();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});


app.use('/graphql', cors(), graphqlHTTP({
  schema,
  graphiql: true
}));

const server = createServer(app);

new SubscriptionServer({ schema, execute, subscribe }, { server, path: '/subscriptions' });

server.listen(8000);
