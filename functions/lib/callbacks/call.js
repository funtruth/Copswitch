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
function onPlayerChoiceHandler(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let test = yield db.get('rooms/****');
        return db.set('testing', test);
    });
}
exports.onPlayerChoiceHandler = onPlayerChoiceHandler;
function onPlayerLoadHandler(change, event) {
    return __awaiter(this, void 0, void 0, function* () {
        let roomId = event.params.roomId;
        let roomSnapshot = yield db.get(`rooms/${roomId}`);
        let choices = change.after.val();
        if (Object.keys(choices).length < helpers.getPlayerCount(roomSnapshot.lobby))
            return;
        let ready;
        (ready = []).length = Object.keys(roomSnapshot.ready).length;
        ready.fill(false);
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