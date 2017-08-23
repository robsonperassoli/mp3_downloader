import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList
} from 'graphql'

import {
  SearchType,
  PlaylistType
} from './types'

import { search, getPlaylist } from '../utils/spotify'

const QueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    search: {
      type: new GraphQLList(SearchType),
      args: {
        query: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve (parentValue, args, request) {
        const searchResults = await search(args.query)

        return searchResults.items.map(playlist => ({
          id: playlist.id,
          name: playlist.name,
          image: playlist.images[0].url,
          userId: playlist.owner.id
        }))
      }
    },
    playlist: {
      type: PlaylistType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve (parentValue, {userId, id}, request) {
        const playlist = await getPlaylist(userId, id)
        
        return {
          ...playlist,
          image: playlist.images[0].url,
          tracks: playlist.tracks.items.map(item => ({
            id: item.track.id,
            name: item.track.name,
            durationInMs: item.track.duration_ms,
            artists: item.track.album.artists.map(a => a.name).join(', ')
          }))
        }
      }
    }
  })
})


export default new GraphQLSchema({
  query: QueryType
})
