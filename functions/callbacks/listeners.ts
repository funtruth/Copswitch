import * as db from './db'

async function onPlayerJoinedRoom(roomId, uid) {
    return db.update(
        `rooms/${roomId}/lobby/${uid}`,
        {
            joinedAt: Date.now(),
        }
    )
}


export {
    onPlayerJoinedRoom,
}