"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("./db");
const helpers = require("./helpers");
const lynching_1 = require("../engines/lynching");
const voting_1 = require("../engines/voting");
function onPlayerChoiceHandler(choices, roomId) {
    return __awaiter(this, void 0, void 0, function* () {
        let roomSnapshot = yield db.get(`rooms/${roomId}`);
        let playerNum = helpers.getPlayerCount(roomSnapshot.lobby);
        let triggerNum = helpers.getTriggerNum(playerNum);
        let gamePhase = roomSnapshot.counter % 3;
        let total = Object.keys(choices).length;
        let batch = {};
        if (gamePhase == 0 && total >= triggerNum) {
            batch = lynching_1.default(choices, roomSnapshot);
        }
        else if (gamePhase == 1 && total >= playerNum - 1) {
            batch = voting_1.default(choices, roomSnapshot);
        }
        else if (gamePhase == 2 && total >= playerNum) {
            //actionModule
        }
        if (batch)
            return db.update(`rooms/${roomId}`, batch);
    });
}
exports.onPlayerChoiceHandler = onPlayerChoiceHandler;
function onPlayerLoadHandler(loaded, roomId) {
    return __awaiter(this, void 0, void 0, function* () {
        let roomSnapshot = yield db.get(`rooms/${roomId}`);
        let playerNum = helpers.getPlayerCount(roomSnapshot.lobby);
        if (Object.keys(loaded).length < playerNum)
            return;
        let ready = {};
        for (var uid in roomSnapshot.ready) {
            ready[uid] = false;
        }
        return db.update(`rooms/${roomId}`, {
            counter: roomSnapshot.counter + 1,
            ready,
            loaded: null,
            choice: null
        });
    });
}
exports.onPlayerLoadHandler = onPlayerLoadHandler;
//# sourceMappingURL=call.js.map