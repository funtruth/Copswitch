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
        let news = [];
        let batch = {};
        for (var j = 0; j < autopsy.length; j++) {
            switch (autopsy[j]) {
                case 'b':
                case 'c':
                case 'd':
                case 'e':
                    dead && news.push(`${lobby[uid].name} was killed by the Mafia.`);
                    break;
                case 'H':
                    dead && news.push(`${lobby[uid].name} was shot by a Hunter.`);
                    break;
                case 'I':
                    batch[`events/${uid}/${Date.now()}`] = 'You were shot by a Soldier!';
                    break;
                case 'K':
                    damaged && (batch[`events/${uid}/${Date.now()}`] = 'You were healed by a Doctor!');
                    break;
                case 'M':
                    damaged && !dead && news.push(`${lobby[uid].name} was shot by a Hunter.`);
                    break;
                default:
            }
        }
        if (news.length > 0) {
            batch[`news/${Date.now()}`] = news.join(' ');
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
    should batchUpdate if this gets bigger
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
        let lobby = yield db.get(`rooms/${roomId}/lobby`);
        if (!lobby)
            return;
        let reviveNote = `${lobby[uid].name} was brought back to life!`;
        return db.update(`rooms/${roomId}/news`, {
            [Date.now()]: reviveNote,
        });
    });
}
exports.onPlayerRevive = onPlayerRevive;
//# sourceMappingURL=gameEvents.js.map