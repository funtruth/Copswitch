"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const call = require("../callbacks/call");
exports.onPlayerLoad = functions.database.ref('/rooms/{roomId}/loaded')
    .onUpdate((change, event) => call.onPlayerLoadHandler(change.after.val(), event.params.roomId));
exports.onPlayerChoice = functions.database.ref('/rooms/{roomId}/choice')
    .onUpdate((change, event) => call.onPlayerChoiceHandler(change, event.params.roomId));
//# sourceMappingURL=index.js.map