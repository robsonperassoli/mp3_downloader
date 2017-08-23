import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { milisecondsToTime } from '../../../utils/time'
import Spinner from 'react-spinkit'

class DownloadPlaylist extends Component {
  render () {
    const { playlist } = this.props.data
    if (!playlist) {
      return <Spinner name='line-scale' className='has-text-centered' />
    }

    return (
      <div className='columns'>
        <div className='column is-one-third'>
          <div className="card">
            <div className="card-image">
              <figure className="image is-4by4">
                <img src={playlist.image} alt={playlist.name} />
              </figure>
            </div>
          </div>
        </div>
        <div className='column'>
          <div className='content'>
            <h2 className='title is-2'>{playlist.name}</h2>
            <a className='button is-primary'>
              <span className='icon is-small'>
                <i className='fa fa-download' />
               </span>
               <span>Start Download</span>
            </a>
            <br />
            <br />
            <progress className="progress is-primary" value="30" max="100">30%</progress>
          </div>
          <table className='table is-fullwidth'>
            <thead>
              <tr>
                <th>#</th>
                <th>Track name</th>
                <th>Artist</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {playlist.tracks.map((track, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{track.name}</td>
                  <td>{track.artists}</td>
                  <td>{milisecondsToTime(track.durationInMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default graphql(gql`
  query DownloadPlaylistQuery($userId: String!, $playlistId: ID!) {
    playlist(userId: $userId, id: $playlistId) {
      id
      userId
      name
      image
      tracks {
        id
        name
        durationInMs
        artists
      }
    }
  }
`, {
  options: ({match: { params: {userId, playlistId}}}) => ({variables: {userId, playlistId}})
})(DownloadPlaylist);
