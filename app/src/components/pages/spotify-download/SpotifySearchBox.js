import React, { Component } from 'react'

class SpotifySearchBox extends Component {
  constructor (props) {
    super(props)

    this.state = {term: ''}
  }

  onChange (event) {
    const term = event.target.value
    this.setState({term})
    this.props.onSearchTermChanged(term)
  }

  render () {
    return (
      <div className="field">
        <div className="control has-icons-right">
          <input
            value={this.state.term}
            onChange={this.onChange.bind(this)}
            className="input is-medium"
            type="text"
            placeholder="Type the playlist name..." />
          <span className="icon is-small is-right">
            <i className="fa fa-search" />
          </span>
        </div>
      </div>
    )
  }
}

export default SpotifySearchBox
