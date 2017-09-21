import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { milisecondsToTime } from '../../../utils/time'
import Spinner from 'react-spinkit'
import { load } from '../../../utils/local-storage'
import { getDownloadUrl } from '../../../utils/urls'

class DownloadPlaylist extends Component {
  constructor (props) {
    super(props)

    this.state = {processingPlaylist: false, downloadFinished: false}
  }
  startDownload () {
    const {match: { params: {userId, playlistId}}} = this.props
    this.props.mutate({
      variables: {userId, playlistId, clientId: load('client-id')}
    })
    this.setState({processingPlaylist: true})
  }

  componentDidMount () {
    this.props.data.subscribeToMore({
      document: gql`
        subscription PlaylistDownloadFinishedSubscription($clientId: String!) {
            playlistDownloadFinished(clientId: $clientId) {
              filename
            }
        }`,
      variables: {
        clientId: load('client-id')
      },
      updateQuery: (prev, {subscriptionData}) => {
        const { filename } = subscriptionData.data.playlistDownloadFinished
        this.setState({ processingPlaylist: false, downloadFinished: true, filename })
      }
    })
  }

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
            {!this.state.processingPlaylist && (
              <a className='button is-primary' onClick={() => this.startDownload()}>
                <span className='icon is-small'>
                  <i className='fa fa-download' />
                </span>
                <span>Start Download</span>
              </a>
            )}
            {this.state.processingPlaylist && (
              <div style={{paddingTop: '30px', paddingLeft: '30px'}}>
                <Spinner name='ball-scale-ripple-multiple' fadeIn='quarter' color='#cccccc' />
                <p style={{marginTop: '-13px', marginLeft: '30px'}}>Wait a minute, we are processing your playlist...</p>
              </div>
            )}
          </div>
          {this.state.downloadFinished && (
            <div className='notification'>
              The file is ready to download: <a href={getDownloadUrl(this.state.filename)}><i className='fa fa-download' /> {this.state.filename}</a>
            </div>
          )}

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

const downloadPlaylistMutation = gql`
  mutation DownloadPlaylistMutation($userId: String!, $playlistId: String!, $clientId: String!) {
    downloadPlaylist(userId: $userId, playlistId: $playlistId, clientId: $clientId) {
      requestId
    }
  }
`

const downloadPlaylistQuery = gql`
  query DownloadPlaylistQuery($userId: String!, $playlistId: ID!) {
    playlist(userId: $userId, playlistId: $playlistId) {
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
`

const DownloadPlaylistWithQuery = graphql(downloadPlaylistQuery, {
  options: ({match: { params: {userId, playlistId}}}) => ({variables: {userId, playlistId}})
})(DownloadPlaylist)

const DownloadPlaylistWithMutation = graphql(downloadPlaylistMutation)(DownloadPlaylistWithQuery)

export default DownloadPlaylistWithMutation;
