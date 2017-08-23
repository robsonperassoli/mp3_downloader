import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {dropdownVisible: false}
  }

  toggleDropdownVisible () {
    this.setState({dropdownVisible: !this.state.dropdownVisible})
  }

  render () {
    return (
      <nav className="navbar is-transparent">
        <a className="navbar-item">
          <img src="http://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28" />
        </a>

        <div className='navbar-item has-dropdown is-hoverable'>
          <a className="navbar-link" onClick={this.toggleDropdownVisible.bind(this)}>Download</a>

          <div className="navbar-dropdown is-boxed">
            <NavLink to='/spotify-download' className="navbar-item" activeClassName='is-active'>From Spotify Playlist</NavLink>
            <NavLink to='/url-download' className="navbar-item" activeClassName='is-active'>From Url</NavLink>
          </div>
        </div>
      </nav>
    )
  }
}
