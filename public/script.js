const socket = io('/')
const  videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})

const myVideo = document.createElement('video')
myVideo.muted =  true

const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStram => {
            addVideoStream(video, userVideoStram)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })

    socket.on('user-disconnect', userId => {
        console.log('disconnect id', userId)
    })
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, 10)
})


const connectToNewUser = (userId, stream) => {
    const call = myPeer.call(userId, stream)
    const video =  document.createElement('video')
    call.on('stream', userVideoStram => {
        addVideoStream(video, userVideoStram)
    })
    call.on('close', () => {
        video.remove()
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)

}