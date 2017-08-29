import 'babel-polyfill'
import 'isomorphic-fetch'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import { gql } from 'react-apollo'

import App from './components/app';
import reducers from './reducers';

const { hostname } = window.location

// Create WebSocket client
const wsClient = new SubscriptionClient(`ws://${hostname}:8000/subscriptions`, {
    reconnect: true,
    connectionParams: {
        // Pass any arguments you want for initialization
    }
});

const networkInterface = createNetworkInterface({
  uri: `http://${hostname}:8000/graphql`
})

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
})

const createStoreWithMiddleware = applyMiddleware()(createStore);

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={createStoreWithMiddleware(reducers)}>
      <BrowserRouter>
        <Route path='/' component={App}/>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>
  , document.querySelector('.container'))
