export function getPlayerCount(lobby) {
    var count = 0
    for (var key in lobby) {
        if (!lobby[key].dead) count++
    }
    return count
}