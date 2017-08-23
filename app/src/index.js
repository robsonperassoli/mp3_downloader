import 'babel-polyfill'
import 'isomorphic-fetch'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

import App from './components/app';
import reducers from './reducers';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:8000/graphql'
  })
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
