import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp()

import {
    onPlayerLoadHandler,
    onPlayerChoiceHandler,
} from '../callbacks/call'

import {
    onPlayerJoinedRoom,
} from '../callbacks/listeners'

exports.onPlayerLoad = functions.database.ref('/rooms/{roomId}/loaded')
    .onUpdate((change, event) => onPlayerLoadHandler(change.after.val(), event.params.roomId))

exports.onPlayerChoice = functions.database.ref('/rooms/{roomId}/choice')
    .onUpdate((change, event) => onPlayerChoiceHandler(change.after.val(), event.params.roomId))

exports.onPlayerJoinedRoom = functions.database.ref('/rooms/{roomId}/lobby/{uid}')
    .onCreate((snap, event) => onPlayerJoinedRoom(event.params.roomId, event.params.uid))