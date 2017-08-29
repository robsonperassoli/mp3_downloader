import React, { Component } from 'react'
import Header from './header'
import Main from './main'
import { save, load } from '../utils/local-storage'
import uuid from 'uuid/v4'

export default class App extends Component {
  componentDidMount () {
    if(!load('client-id')) {
      save('client-id', uuid())
    }
  }

  render() {
    return (
      <section className='container is-fluid'>
        <Header />

        <Main />
      </section>
    );
  }
}
