export function getPlayerCount(l) {
    var c = 0
    for (var k in l) {
        if (!l[k].dead) c++
    }
    return c
}

export function getTriggerNum(p) {
    return (p - p%2)/2 + 1
}