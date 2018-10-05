"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const listeners_1 = require("../engines/listeners");
const gameEvents_1 = require("../engines/gameEvents");
//listeners
exports.onPlayerJoinedRoom = functions.database.ref('/rooms/{roomId}/lobby/{uid}')
    .onCreate((snap, event) => listeners_1.onPlayerJoinedRoom(event.params.roomId, event.params.uid));
exports.onGameStatusUpdate = functions.database.ref('/rooms/{roomId}/config/status')
    .onUpdate((change, event) => listeners_1.onGameStatusUpdate(change, event.params.roomId));
exports.onPlayerLoad = functions.database.ref('/rooms/{roomId}/loaded')
    .onUpdate((change, event) => listeners_1.onPlayerLoadHandler(change.after.val(), event.params.roomId));
exports.onPlayerChoice = functions.database.ref('/rooms/{roomId}/choice')
    .onUpdate((change, event) => listeners_1.onPlayerChoiceHandler(change.after.val(), event.params.roomId));
//game events
exports.onPlayerDamaged = functions.database.ref(`rooms/{roomId}/lobby/{uid}/health`)
    .onCreate((snap, event) => gameEvents_1.onPlayerDamaged(snap.val(), event.params.roomId, event.params.uid));
exports.onPlayerDeath = functions.database.ref('rooms/{roomId}/lobby/{uid}/dead')
    .onCreate((snap, event) => gameEvents_1.onPlayerDeath(event.params.roomId, event.params.uid));
exports.onPlayerResurrect = functions.database.ref('rooms/{roomId}/lobby/{uid}/dead')
    .onDelete((snap, event) => gameEvents_1.onPlayerRevive(event.params.roomId, event.params.uid));
//# sourceMappingURL=index.js.map