"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getPlayerCount(lobby) {
    var count = 0;
    for (var key in lobby) {
        if (!lobby[key].dead)
            count++;
    }
    return count;
}
exports.getPlayerCount = getPlayerCount;
//# sourceMappingURL=helpers.js.map