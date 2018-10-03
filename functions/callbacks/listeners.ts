import * as db from './db'

async function onPlayerJoinedRoom(roomId, uid) {
    //await player info like name, etc
    return db.update(
        `rooms/${roomId}/lobby/${uid}`,
        {
            joinedAt: Date.now(),
        }
    )
}

async function onGameStatusUpdate(change, roomId) {
    if (change.before.val() !== 'statusType/lobby' || change.after.val() !== 'statusType/pregame') return
    
    let rss = await db.get(`rooms/${roomId}`)
    
    let rolesArr = [];
    for(var id in rss.roles){
        for(var j=0; j<rss.roles[id]; j++){
            rolesArr.push(id)
        }
    }

    //Fisher-Yates Shuffle
    let counter = rolesArr.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);

        counter--;

        let temp = rolesArr[counter];
        rolesArr[counter] = rolesArr[index];
        rolesArr[index] = temp;
    }

    //Finishing player details
    let lobby = rss.lobby
    let ready = {}
    counter = 0
    
    for (var uid in rss.lobby) {
        lobby[uid].roleId = rolesArr[counter]
        
        ready[uid] = false
        counter++
    }

    return db.update(
        `rooms/${roomId}`,
        {
            lobby,
            ready,
            counter: 0,
            status: 'statusType/game'
        }
    )
}

export {
    onPlayerJoinedRoom,
    onGameStatusUpdate,
}