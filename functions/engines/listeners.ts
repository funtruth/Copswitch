import * as db from '../common/db'
import * as helpers from '../common/helpers'
import * as logic from './logic'

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
    for(var id in rss.config.roles){
        for(var j=0; j<rss.config.roles[id]; j++){
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
            gameState: {
                counter: 0,
                phase: 0,
                dayNum: 1,
            },
            config: {
                status: 'statusType/game'
            }
        }
    )
}

async function onPlayerChoiceHandler(choices, roomId) {
    let roomSnapshot = await db.get(`rooms/${roomId}`)
    let playerNum = helpers.getPlayerCount(roomSnapshot.lobby)
    let triggerNum = helpers.getTriggerNum(playerNum)
    let gamePhase = roomSnapshot.gameState.phase

    let total = Object.keys(choices).length;
    let batch = {}

    if (gamePhase == 0 && total >= triggerNum){
        batch = logic.onVote(choices, roomSnapshot)
    } else if (gamePhase == 1 && total >= playerNum - 1){
        batch = logic.onTrial(choices, roomSnapshot)
    } else if (gamePhase == 2 && total >= playerNum){
        batch = logic.onNight(choices, roomSnapshot)
    } else {
        return
    }

    return db.update(`rooms/${roomId}`, batch)
}

async function onPlayerLoadHandler(loaded, roomId) {
    let roomSnapshot = await db.get(`rooms/${roomId}`)
    let playerNum = helpers.getPlayerCount(roomSnapshot.lobby)

    if (Object.keys(loaded).length < playerNum) return

    let ready = {};
    for (var uid in roomSnapshot.ready) {
        ready[uid] = false
    }

    return db.update(
        `rooms/${roomId}`,
        {
            ready,
            loaded: null,
            choice: null,
        }
    )
}

export {
    onPlayerJoinedRoom,
    onGameStatusUpdate,
    onPlayerChoiceHandler,
    onPlayerLoadHandler,
}