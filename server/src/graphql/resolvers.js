import pubsub from './pubsub'
import { withFilter } from 'graphql-subscriptions';
import { search, getPlaylist } from '../utils/spotify'
import kue from 'kue'

const queue = kue.createQueue()

export default {
  Query: {
    search:  async (root, args, request) => {
      console.log('doing search', args)
      const searchResults = await search(args.query)

      return searchResults.items.map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        image: playlist.images[0].url,
        userId: playlist.owner.id
      }))
    },
    playlist:  async (root, {userId, playlistId}, request) => {
      const playlist = await getPlaylist(userId, playlistId)

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
  },
  Mutation: {
    downloadPlaylist: async (parentValue, { userId, playlistId, clientId }, context) => {
      return new Promise((resolve, reject) => {
        const job = queue.create('playlist-download', {userId, playlistId, clientId}).save(err => {
          if(err) {
            reject(err)
          } else {
            resolve({
              requestId: job.id
            })
          }
        });
      })
    }
  },
  Subscription: {
    playlistDownloadFinished: {
      resolve: async (payload, args, context, info) => {
        console.log('payload', payload);
        console.log('args', args);

        return payload;
      },
      subscribe: withFilter(() => pubsub.asyncIterator('playlistDownloadFinished'), (payload, variables, context, info) => {
        console.log('subscribe filter', payload, variables)
        return payload.clientId === variables.clientId;
      })
    }
  }
}
