import kue from 'kue'
import { getPlaylist } from './utils/spotify'
import { findSongsVideo, saveMp3FromVideos } from './utils/youtube'
import { createZipWithLocalFiles } from './utils/zip'
import { MP3_OUTPUT_PATH, ZIP_OUTPUT_PATH } from './config'
import uuid from 'uuid/v4'
import pubsub from './graphql/pubsub'

const queue = kue.createQueue();
queue.process('playlist-download', async (job, done) => {
  try {
    const { userId, playlistId, clientId } = job.data
    const playlist = await getPlaylist(userId, playlistId)

    const musicNames = playlist.tracks.items.map(item => `${item.track.name}-${item.track.artists.map(a => a.name).join(',')}`)

    const videos = await findSongsVideo(musicNames)

    console.log('received playlist to download')

    const youtubeVideoIds = videos.filter(video => !!video.videoId).map(video => video.videoId)
    const savedFiles = await saveMp3FromVideos(youtubeVideoIds)
    console.log('mp3 files saved')

    const videosSongNameMap = new Map()
    videos.forEach(video => videosSongNameMap.set(video.videoId, video.songName))

    const zipFileNames = []
    savedFiles.forEach((mp3FilePath, videoId) => {
      zipFileNames.push({path: mp3FilePath, name: `${videosSongNameMap.get(videoId)}.mp3`})
    })

    console.log('starting zip creation')
    const zipName = `${uuid()}.zip`
    await createZipWithLocalFiles(zipFileNames, `${ZIP_OUTPUT_PATH}/${zipName}`)
    console.log('zip file done')

    pubsub.publish('playlistDownloadFinished', { clientId, filename: zipName })

    done()
  } catch(err) {
    console.error(err)
    done(err)
  }
});
