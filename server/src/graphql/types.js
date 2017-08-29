export default `
  type SearchType {
    id: String,
    name: String,
    image: String,
    userId: String
  }

  type TrackType {
    id: ID,
    name: String,
    durationInMs: Int,
    artists: String
  }

  type PlaylistType {
    id: ID,
    userId: ID,
    name: String,
    image: String,
    tracks: [TrackType]
  }

  type DownloadPlaylistPayloadType {
    requestId: ID
  }

  type DownloadPlaylistFinishedPayloadType {
    filename: String
  }

  type Query {
    search(query: String!): [SearchType],
    playlist(userId: String!, playlistId: ID!): PlaylistType
  }

  type Subscription {
    playlistDownloadFinished(clientId: String!): DownloadPlaylistFinishedPayloadType
  }

  type Mutation {
    downloadPlaylist(userId: String!, playlistId: String!, clientId: String!): DownloadPlaylistPayloadType
  }
`
