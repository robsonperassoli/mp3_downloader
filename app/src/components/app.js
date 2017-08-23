import React, { Component } from 'react'
import Header from './header'
import Main from './main'

export default class App extends Component {
  render() {
    return (
      <section className='container is-fluid'>
        <Header />

        <Main />
      </section>
    );
  }
}
