import * as db from './db'
import * as helpers from './helpers'

export async function onPlayerChoiceHandler(change, event) {
    let test = await db.get('rooms/****')
    return db.set('testing', test)
}

export async function onPlayerLoadHandler(change, event) {
    let roomId = event.params.roomId
    let roomSnapshot = await db.get(`rooms/${roomId}`)
    let choices = change.after.val()

    if (Object.keys(choices).length < helpers.getPlayerCount(roomSnapshot.lobby)) return

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