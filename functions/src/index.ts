import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp()

import * as call from '../callbacks/call'

exports.onPlayerLoad = functions.database.ref('/rooms/{roomId}/loaded').onWrite(call.onPlayerLoadHandler)

exports.onPlayerChoice = functions.database.ref('/rooms/{roomId}/choice').onWrite(call.onPlayerChoiceHandler)