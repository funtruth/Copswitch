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
const db = require("../common/db");
const _ = require("lodash");
const roles_1 = require("./roles");
function onPlayerDamaged(snap, roomId, uid) {
    return __awaiter(this, void 0, void 0, function* () {
        let lobby = yield db.get(`rooms/${roomId}/lobby`);
        let gameState = yield db.get(`rooms/${roomId}/gameState`);
        let timestamp = Date.now();
        let defaultInfo = {
            timestamp,
            counter: gameState.counter,
        };
        let health = 0;
        let damaged = false;
        let autopsy = [];
        for (var i in snap) {
            if (snap[i] < 0) {
                damaged = true;
            }
            autopsy.push(lobby[i].roleId);
            health += snap[i];
        }
        let dead = health < 0;
        let report = [];
        let batch = {};
        for (var j = 0; j < autopsy.length; j++) {
            switch (autopsy[j]) {
                case 'b':
                case 'c':
                case 'd':
                case 'e':
                    dead && report.push(`${lobby[uid].name} was killed by the Mafia.`);
                    break;
                case 'H':
                    dead && report.push(`${lobby[uid].name} was shot by a Hunter.`);
                    break;
                case 'I':
                    batch[`events/${uid}/${timestamp}`] = Object.assign({ message: 'You were shot by a Soldier!' }, defaultInfo);
                    break;
                case 'K':
                    damaged && (batch[`events/${uid}/${timestamp}`] = Object.assign({ message: 'You were healed by a Doctor!' }, defaultInfo));
                    break;
                case 'M':
                    damaged && !dead && report.push(`${lobby[uid].name} was shot by a Hunter.`);
                    break;
                default:
            }
        }
        if (report.length > 0) {
            batch[`news/${timestamp}`] = {
                message: report.join(' '),
                timestamp,
                counter: gameState.counter,
            };
        }
        else {
            return;
        }
        if (dead) {
            batch[`lobby/${uid}/dead`] = true;
        }
        return db.update(`rooms/${roomId}`, batch);
    });
}
exports.onPlayerDamaged = onPlayerDamaged;
/*uses
    assigning new killer
*/
function onPlayerDeath(roomId, uid) {
    return __awaiter(this, void 0, void 0, function* () {
        let lobby = yield db.get(`rooms/${roomId}/lobby`);
        if (roles_1.default[lobby[uid].roleId].killer) {
            let _lobby = _.filter(lobby, i => roles_1.default[i.roleId].type === 1);
            let heir = _.sample(_lobby);
            heir.roleId = 'e';
            return db.update(`rooms/${roomId}/lobby/${heir.uid}`, heir);
        }
        return;
    });
}
exports.onPlayerDeath = onPlayerDeath;
function onPlayerRevive(roomId, uid) {
    return __awaiter(this, void 0, void 0, function* () {
        let { lobby, gameState } = yield db.get(`rooms/${roomId}`);
        if (!lobby)
            return;
        let reviveNote = `${lobby[uid].name} was brought back to life!`;
        let timestamp = Date.now();
        return db.update(`rooms/${roomId}/news/${timestamp}`, {
            message: reviveNote,
            timestamp,
            counter: gameState.counter
        });
    });
}
exports.onPlayerRevive = onPlayerRevive;
//# sourceMappingURL=gameEvents.js.map