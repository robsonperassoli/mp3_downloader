import kue from 'kue'

const queue = kue.createQueue();

const job = queue.create('playlist-download', {
    playlistId: '37i9dQZF1DXdSjVZQzv2tl',
    userId: 'spotify'
}).save(err => {
   if( !err ) console.log( job.id );
});
