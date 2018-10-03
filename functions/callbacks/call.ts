import * as db from './db'
import * as helpers from './helpers'
import lynching from '../engines/lynching'
import voting from '../engines/voting'

async function onPlayerChoiceHandler(choices, roomId) {
    let roomSnapshot = await db.get(`rooms/${roomId}`)
    let playerNum = helpers.getPlayerCount(roomSnapshot.lobby)
    let triggerNum = helpers.getTriggerNum(playerNum)
    let gamePhase = roomSnapshot.counter % 3

    let total = Object.keys(choices).length;
    let batch = {}

    if (gamePhase == 0 && total >= triggerNum){
        batch = lynching(choices, roomSnapshot)
    } else if (gamePhase == 1 && total >= playerNum - 1){
        batch = voting(choices, roomSnapshot)
    } else if (gamePhase == 2 && total >= playerNum){
        //actionModule
    }

    if (batch) return db.update(`rooms/${roomId}`, batch)
}

async function onPlayerLoadHandler(loaded, roomId) {
    let roomSnapshot = await db.get(`rooms/${roomId}`)
    let playerNum = helpers.getPlayerCount(roomSnapshot.lobby)

    if (Object.keys(loaded).length < playerNum) return

    let ready
    (ready = []).length = Object.keys(roomSnapshot.ready).length
    ready.fill(false)

    return db.update(
        `rooms/${roomId}`,
        {
            counter: roomSnapshot.counter + 1,
            ready,
            loaded: null,
            choice: null
        }
    )
}

export {
    onPlayerChoiceHandler,
    onPlayerLoadHandler,
}