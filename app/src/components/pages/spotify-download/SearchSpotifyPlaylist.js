import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { gql } from 'react-apollo'
import _ from 'lodash'
import SpotifySearchBox from './SpotifySearchBox'
import SpotifySearchResultList from './SpotifySearchResultList'
import Spinner from 'react-spinkit';

const query = gql`
  query SpotifySearchPlaylistsQuery($query: String!) {
    search(query: $query) {
      id
      name
      image
      userId
    }
  }
`

class SearchSpotifyPlaylist extends Component {
  constructor (props) {
    super(props)

    this.state = {searchResults: [], searching: false}
  }

  async searchPlaylists (searchTerm) {
    this.setState({searchResults: []})
    if (searchTerm) {
      this.setState({searching: true})
      const result = await this.props.client.query({
        query,
        variables: {
          query: searchTerm
        }
      })

      this.setState({searchResults: result.data.search, searching: false})
    }
  }

  render () {
    const spotifySearch = _.debounce(searchTerm => this.searchPlaylists(searchTerm), 200)
    return (
      <section className="hero">
        <div className="hero-body">
          <p className="title">Spotify</p>
          <p className="subtitle">Download your favorite Spotify playlist</p>
        </div>

        <SpotifySearchBox onSearchTermChanged={spotifySearch}/>

        {this.state.searching ? (
          <Spinner name='line-scale' className='has-text-centered' />
        ) : (
          <SpotifySearchResultList list={this.state.searchResults} />
        )}

      </section>
    )
  }
}

export default withApollo(SearchSpotifyPlaylist)
