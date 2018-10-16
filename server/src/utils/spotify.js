import SpotifyWebApi from 'spotify-web-api-node'
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../config'
import addSeconds from 'date-fns/add_seconds'
import isAfter from 'date-fns/is_after'

const spotifyApi = new SpotifyWebApi({
  clientId : SPOTIFY_CLIENT_ID,
  clientSecret : SPOTIFY_CLIENT_SECRET
})

let tokenExpirationDate = null

async function grantPermissions() {
  const tokenSet = !!tokenExpirationDate
  const tokenExpired = tokenSet ? isAfter(new Date(), tokenExpirationDate) : false

  if (!tokenSet || tokenExpired) {
    console.log('requesting a new access token from spotify')

    const grantResponse = await spotifyApi.clientCredentialsGrant()
    const { access_token: accessToken, expires_in: expiresIn } = grantResponse.body
    spotifyApi.setAccessToken(accessToken)
    tokenExpirationDate = addSeconds(new Date(), expiresIn - 60)
  }
}

export async function search (query) {
  await grantPermissions()
  return spotifyApi.search(query, ['playlist'], { limit: 20, offset: 0 })
    .then(data => data.body.playlists)
}

export async function getPlaylist (userId, playlistId) {
  await grantPermissions()
  const playlistPromise = spotifyApi.getPlaylist(userId, playlistId)
  const tracksPromise = spotifyApi.getPlaylistTracks(userId, playlistId)

  const playlist = await playlistPromise
  const tracks = await tracksPromise

  return {
    ...playlist.body,
    tracks: tracks.body
  }
}
