"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const call_1 = require("../callbacks/call");
const listeners_1 = require("../callbacks/listeners");
exports.onPlayerLoad = functions.database.ref('/rooms/{roomId}/loaded')
    .onUpdate((change, event) => call_1.onPlayerLoadHandler(change.after.val(), event.params.roomId));
exports.onPlayerChoice = functions.database.ref('/rooms/{roomId}/choice')
    .onUpdate((change, event) => call_1.onPlayerChoiceHandler(change.after.val(), event.params.roomId));
exports.onPlayerJoinedRoom = functions.database.ref('/rooms/{roomId}/lobby/{uid}')
    .onCreate((snap, event) => listeners_1.onPlayerJoinedRoom(event.params.roomId, event.params.uid));
exports.onGameStatusUpdate = functions.database.ref('/rooms/{roomId}/config/status')
    .onUpdate((change, event) => listeners_1.onGameStatusUpdate(change, event.params.roomId));
//# sourceMappingURL=index.js.map