import SpotifyWebApi from 'spotify-web-api-node'
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '../config'

const spotifyApi = new SpotifyWebApi({
  clientId : SPOTIFY_CLIENT_ID,
  clientSecret : SPOTIFY_CLIENT_SECRET
})

let accessTokenSet = false

async function setAccessToken() {
  // create logic to validate token expiration time
  if (!accessTokenSet) {
      const grantResponse = await spotifyApi.clientCredentialsGrant()
      spotifyApi.setAccessToken(grantResponse.body.access_token)
      accessTokenSet = true
  }
}

export async function search (query) {
  await setAccessToken()
  return spotifyApi.search(query, ['playlist'], { limit: 20, offset: 0 })
    .then(data => data.body.playlists)
}

export async function getPlaylist (userId, playlistId) {
  await setAccessToken()
  const playlistPromise = spotifyApi.getPlaylist(userId, playlistId)
  const tracksPromise = spotifyApi.getPlaylistTracks(userId, playlistId)

  const playlist = await playlistPromise
  const tracks = await tracksPromise

  return {
    ...playlist.body,
    tracks: tracks.body
  }
}
