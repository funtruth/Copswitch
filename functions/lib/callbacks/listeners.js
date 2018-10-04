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
function onPlayerJoinedRoom(roomId, uid) {
    return __awaiter(this, void 0, void 0, function* () {
        //await player info like name, etc
        return db.update(`rooms/${roomId}/lobby/${uid}`, {
            joinedAt: Date.now(),
        });
    });
}
exports.onPlayerJoinedRoom = onPlayerJoinedRoom;
function onGameStatusUpdate(change, roomId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (change.before.val() !== 'statusType/lobby' || change.after.val() !== 'statusType/pregame')
            return;
        let rss = yield db.get(`rooms/${roomId}`);
        let rolesArr = [];
        for (var id in rss.roles) {
            for (var j = 0; j < rss.roles[id]; j++) {
                rolesArr.push(id);
            }
        }
        //Fisher-Yates Shuffle
        let counter = rolesArr.length;
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter--;
            let temp = rolesArr[counter];
            rolesArr[counter] = rolesArr[index];
            rolesArr[index] = temp;
        }
        //Finishing player details
        let lobby = rss.lobby;
        let ready = {};
        counter = 0;
        for (var uid in rss.lobby) {
            lobby[uid].roleId = rolesArr[counter];
            ready[uid] = false;
            counter++;
        }
        return db.update(`rooms/${roomId}`, {
            lobby,
            ready,
            counter: 0,
            status: 'statusType/game'
        });
    });
}
exports.onGameStatusUpdate = onGameStatusUpdate;
//# sourceMappingURL=listeners.js.map