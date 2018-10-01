"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getPlayerCount(l) {
    var c = 0;
    for (var k in l) {
        if (!l[k].dead)
            c++;
    }
    return c;
}
exports.getPlayerCount = getPlayerCount;
function getTriggerNum(p) {
    return (p - p % 2) / 2 + 1;
}
exports.getTriggerNum = getTriggerNum;
//# sourceMappingURL=helpers.js.map