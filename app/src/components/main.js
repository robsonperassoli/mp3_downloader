import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './pages/home'
import SearchSpotifyPlaylist from './pages/spotify-download/SearchSpotifyPlaylist'
import DownloadPlaylist from './pages/spotify-download/DownloadPlaylist'
import UrlDownload from './pages/url-download'

export default (props) => (
  <Switch>
    <Route path='/spotify-download/playlist/:userId/:playlistId' component={DownloadPlaylist} />
    <Route path='/spotify-download' component={SearchSpotifyPlaylist} />
    <Route path='/url-download' component={UrlDownload} />
    <Route path='/' component={Home} />
  </Switch>
)
