import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp()

import {
    onPlayerJoinedRoom,
    onGameStatusUpdate,
    onPlayerLoadHandler,
    onPlayerChoiceHandler,
} from '../engines/listeners'

import {
    onPlayerDamaged,
    onPlayerDeath,
    onPlayerRevive,
} from '../engines/gameEvents'

//listeners
exports.onPlayerJoinedRoom = functions.database.ref('/rooms/{roomId}/lobby/{uid}')
    .onCreate((snap, event) => onPlayerJoinedRoom(event.params.roomId, event.params.uid))

exports.onGameStatusUpdate = functions.database.ref('/rooms/{roomId}/config/status')
    .onUpdate((change, event) => onGameStatusUpdate(change, event.params.roomId))

exports.onPlayerLoad = functions.database.ref('/rooms/{roomId}/loaded')
    .onUpdate((change, event) => onPlayerLoadHandler(change.after.val(), event.params.roomId))

exports.onPlayerChoice = functions.database.ref('/rooms/{roomId}/choice')
    .onUpdate((change, event) => onPlayerChoiceHandler(event.params.roomId))

//game events
exports.onPlayerDamaged = functions.database.ref(`rooms/{roomId}/lobby/{uid}/health`)
    .onCreate((snap, event) => onPlayerDamaged(snap.val(), event.params.roomId, event.params.uid))

exports.onPlayerDeath = functions.database.ref('rooms/{roomId}/lobby/{uid}/dead')
    .onCreate((snap, event) => onPlayerDeath(event.params.roomId, event.params.uid))

exports.onPlayerResurrect = functions.database.ref('rooms/{roomId}/lobby/{uid}/dead')
    .onDelete((snap, event) => onPlayerRevive(event.params.roomId, event.params.uid))