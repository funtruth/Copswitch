import * as db from './db'

export async function onPlayerChoiceHandler(event) {
    let test = await db.get('rooms/****')
    return db.set('testing', test)
}

export async function onPlayerLoadHandler(event) {
    let test = await db.get('rooms/****')
    return db.set('testing', test)
}