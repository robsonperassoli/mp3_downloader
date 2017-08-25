import YouTube from 'youtube-node'
import YoutubeMp3Downloader from 'youtube-mp3-downloader';
import { exists } from './files'
import {YOUTUBE_API_KEY, MP3_OUTPUT_PATH} from '../config'

const youTube = new YouTube();
youTube.setKey(YOUTUBE_API_KEY);

const createSong = (songName, videoId) => ({songName, videoId});

async function getSongVideoId(song) {
  return new Promise((resolve, reject) => {
    youTube.search(song, 2, (error, result) => {
      if (error) {
        reject(`ERROR: ${song} -> ${error}`);
      } else {
        if(!result.items[0] || !result.items[0].id.videoId) {
          resolve(createSong(song, null));
        } else {
          const videoId = result.items[0].id.videoId;
          resolve(createSong(song, videoId));
        }
      }
    });
  });
};

export async function findSongsVideo(musicNames) {
  try {
    const videoIdPromises = musicNames.map(getSongVideoId);
    return await Promise.all(videoIdPromises);
  } catch(e) {
    console.error(e);
  }
}

export async function saveMp3FromVideos(videoIds) {
  const downloader = new YoutubeMp3Downloader({
    //ffmpegPath: "/usr/bin/ffmpeg",
    outputPath: MP3_OUTPUT_PATH,
    //youtubeVideoQuality: "highest",
    queueParallelism: 8,
    progressTimeout: 2000
  })

  const toDownload = videoIds.filter(videoId => !exists(`${MP3_OUTPUT_PATH}/${videoId}`))
  let finishedCount = 0
  const totalCount = toDownload.length
  
  toDownload.forEach(videoId => downloader.download(videoId, videoId/* filename */))

  const savedFilesMap = new Map()
  videoIds.forEach(videoId => {
    savedFilesMap.set(videoId, `${MP3_OUTPUT_PATH}/${videoId}`)
  })

  return new Promise((resolve, reject) => {
    if(totalCount === 0) {
      resolve(savedFilesMap)
    }
    
    downloader.on('finished', function(err, data) {
      finishedCount++

      if(finishedCount === totalCount) {
        resolve(savedFilesMap)
      }
    });

    downloader.on('error', function(error) {
        reject(error)
    });
  })
}
