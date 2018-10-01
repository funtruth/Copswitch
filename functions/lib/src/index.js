"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const call = require("../callbacks/call");
exports.onPlayerLoad = functions.database.ref('/rooms/{roomId}/loaded').onWrite(call.onPlayerLoadHandler);
exports.onPlayerChoice = functions.database.ref('/rooms/{roomId}/choice').onWrite(call.onPlayerChoiceHandler);
//# sourceMappingURL=index.js.map