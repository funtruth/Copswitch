"use strict";
/*
sus: appears suspicious if investigated
rbi: immune to roleblock
killer: produces an heir if killed
priority: prep100, tag200, do300
text: default event text to target
sneak: does not visit when visiting
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    a: {
        name: "Informant",
        sus: true,
        type: 1,
        priority: 300,
    },
    b: {
        name: "Fugitive",
        sus: true,
        type: 1,
        priority: 300,
    },
    c: {
        name: "Assassin",
        killer: true,
        type: 1,
        priority: 300,
        text: 'Someone attacked you!',
    },
    d: {
        name: "Ninja",
        sus: true,
        killer: "e",
        type: 1,
        sneak: true,
        text: 'Someone attacked you!',
    },
    e: {
        name: "Murderer",
        sus: true,
        killer: "e",
        type: 1,
        text: 'Someone attacked you!',
    },
    f: {
        name: "Thug",
        sus: true,
        type: 1,
    },
    g: {
        name: "Consort",
        sus: true,
        rbi: true,
        type: 1
    },
    h: {
        name: "Forger",
        sus: true,
        type: 1
    },
    i: {
        name: "Underboss",
        sus: true,
        type: 1,
    },
    j: {
        name: "Politician",
        sus: true,
        type: 1,
    },
    k: {
        name: "Schemer",
        sus: true,
        type: 1,
        priority: 200,
    },
    l: {
        name: "Silencer",
        sus: true,
        type: 1,
        text: 'You were silenced last night! You cannot talk or communicate today.',
    },
    m: {
        name: "Drunk",
        sus: true,
        type: 1
    },
    n: {
        name: "Voodoo",
        sus: true,
        type: 1
    },
    A: {
        name: "Detective",
        type: 2,
        priority: 300,
    },
    B: {
        name: "Warden",
        type: 2,
        priority: 150,
        sneak: true,
    },
    C: {
        name: "Prophet",
        type: 2,
    },
    D: {
        name: "Private",
        type: 2,
    },
    E: {
        name: "Nostalgic",
        type: 2,
        text: 'You remembered your friend, and changed your identity.',
    },
    F: {
        name: "Listener",
        type: 2,
    },
    G: {
        name: "Investigator",
        type: 2,
    },
    H: {
        name: "Hunter",
        type: 2,
        text: 'You were shot by a Hunter!',
        priority: 200,
    },
    I: {
        name: "Soldier",
        rbi: true,
        type: 2,
    },
    J: {
        name: "Villager",
        type: 2,
    },
    K: {
        name: "Doctor",
        type: 2,
        priority: 300,
    },
    L: {
        name: "Bodyguard",
        type: 2,
    },
    M: {
        name: "Priest",
        type: 2,
    },
    N: {
        name: "Keeper",
        type: 2,
    },
    O: {
        name: "Bouncer",
        type: 2,
    },
    P: {
        name: "Cupid",
        type: 2,
    },
    Q: {
        name: "Escort",
        rbi: true,
        type: 2,
    },
    R: {
        name: "Ritualist",
        type: 2,
    },
    S: {
        name: "Mayor",
        type: 2,
    },
    T: {
        name: "Survivor",
        type: 2,
    },
    U: {
        name: "Painter",
        type: 2,
    },
    V: {
        name: "Apprentice",
        type: 2,
    }
};
//# sourceMappingURL=roles.js.map