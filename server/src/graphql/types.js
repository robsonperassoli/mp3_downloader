import {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList
} from 'graphql'

export const SearchType = new GraphQLObjectType({
  name: 'SearchType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    image: { type: GraphQLString },
    userId: { type: GraphQLString }
  })
})

export const TrackType = new GraphQLObjectType({
  name: 'TrackType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    durationInMs: { type: GraphQLInt },
    artists: { type: GraphQLString }
  })
})

export const PlaylistType = new GraphQLObjectType({
  name: 'PlaylistType',
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    name: { type: GraphQLString },
    image: { type: GraphQLString },
    tracks: { type: new GraphQLList(TrackType)}
  })
})
