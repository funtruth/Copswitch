"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const roles_1 = require("./roles");
const helpers = require("../common/helpers");
function setGameState(counter) {
    return {
        counter,
        phase: counter % 3,
        dayNum: Math.floor(counter / 3) + 1,
    };
}
function onVote(choices, rss) {
    let ballots = {};
    let ballotCount = 0;
    let playerNum = helpers.getPlayerCount(rss.lobby);
    let triggerNum = helpers.getTriggerNum(playerNum);
    for (var uid in choices) {
        if (choices[uid] !== null) {
            ballots[choices[uid]] ? ballots[choices[uid]]++ : ballots[choices[uid]] = 1;
            ballotCount++;
        }
    }
    let nominate = null;
    for (var uid in ballots) {
        if (ballots[uid] >= triggerNum) {
            nominate = uid;
            break;
        }
    }
    if (nominate) {
        return {
            [`news/${Date.now()}`]: `${rss.lobby[nominate].name} has been put on trial.`,
            gameState: setGameState(rss.gameState.counter + 1),
            nominate,
            choice: null,
            ready: null
        };
    }
    else if (ballotCount >= playerNum) {
        return {
            gameState: setGameState(rss.gameState.counter + 2),
            nominate: null,
            choice: null,
            ready: null
        };
    }
    return {};
}
exports.onVote = onVote;
function onTrial(votes, rss) {
    let iVotes = [];
    let gVotes = [];
    let news = {};
    let timestamp = Date.now();
    for (var uid in votes) {
        if (votes[uid] === 1) {
            iVotes.push(rss.lobby[uid].name);
        }
        else if (votes[uid] === -1) {
            gVotes.push(rss.lobby[uid].name);
        }
    }
    let nameString = '';
    if (gVotes.length === 0) {
        nameString = 'Nobody ';
    }
    else if (gVotes.length === 1) {
        nameString = gVotes[0];
    }
    else {
        nameString = gVotes.join(', ');
    }
    news[timestamp] = nameString + ' voted against' + rss.lobby[rss.nominate].name + '.';
    let nextCounter;
    if (gVotes.length > iVotes.length) {
        rss.lobby[rss.nominate].dead = true;
        news[timestamp + 1] = rss.lobby[rss.nominate].name + ' has been hung!';
        nextCounter = rss.gameState.counter + 1;
    }
    else {
        news[timestamp + 1] = rss.lobby[rss.nominate].name + ' was not hung.';
        nextCounter = rss.gameState.counter - 1;
    }
    return {
        news,
        lobby: rss.lobby,
        gameState: setGameState(nextCounter),
        nominate: null,
        ready: null,
        choice: null,
    };
}
exports.onTrial = onTrial;
function onNight(choices, rss) {
    let lobby = rss.lobby;
    let events = {};
    let actions = [];
    //push all actions into an array with their prio
    for (var uid in lobby) {
        actions.push({
            uid,
            priority: roles_1.default[lobby[uid].roleId].priority,
        });
        events[uid] = {};
    }
    //shuffle order & stable sort by prio
    _.shuffle(actions);
    actions.sort((a, b) => a.priority - b.priority);
    //do all actions
    for (var i = 0; i < actions.length; i++) {
        _action(actions[i].uid, rss.lobby, choices, events);
    }
    //clean up lobby before writing it
    for (var uid in lobby) {
        lobby[uid].flag = undefined;
        lobby[uid].health = undefined;
    }
    return {
        [`events/${Date.now()}`]: events,
        lobby,
        gameState: setGameState(rss.gameState.counter + 1),
        choice: null,
        ready: null,
    };
}
exports.onNight = onNight;
//[a]ctor
//check for flags, give event text, do role
function _action(a, lobby, choices, events) {
    var flags = lobby[choices[a]].flag;
    if (flags) {
        for (var uid in flags) {
            flags[uid](a, lobby);
        }
    }
    if (roles_1.default[lobby[a].roleid].text) {
        events[choices[a]][Date.now()] = roles_1.default[lobby[a].roleid].text;
    }
    switch (lobby[a].roleId) {
        case 'a':
            events[a][Date.now()] = `Your target is a ${roles_1.default[lobby[choices[a]].roleId].name}.`;
            break;
        case 'c':
        case 'd':
        case 'e':
            lobby[choices[a]].health[a] = -1;
            break;
        case 'k':
            lobby[choices[a]].sus = true;
            break;
        case 'A':
            if (roles_1.default[lobby[choices[a]].roleId].sus || lobby[choices[a]].sus) {
                events[a][Date.now()] = 'Your target is suspicious. They are a member of the mafia!';
            }
            else {
                events[a][Date.now()] = 'Your target is not suspicious.';
            }
            break;
        case 'B':
            lobby[choices[a]].flag[a] = (v, lobby) => {
                if (!roles_1.default[lobby[v].roleId].sneak) {
                    events[a][Date.now()] = `${lobby[v].name} visited your target last night!`;
                }
            };
            break;
        case 'E':
            lobby[a].roleId = lobby[choices[a]].roleId;
            break;
        case 'H':
            lobby[choices[a]].health[a] = -1;
            break;
        case 'K':
            lobby[choices[a]].health[a] = 1;
            break;
        case 'g':
        case 'Q':
            if (!roles_1.default[lobby[choices[a]].roleId].rbi) {
                choices[choices[a]] = -1;
                events[choices[a]][Date.now()] = 'You were distracted last night.';
            }
            else {
                events[choices[a]][Date.now()] = 'Someone tried to distract you, but you were not affected.';
            }
            break;
        case 'I':
            if (a === choices[a]) {
                lobby[a].health[a] = 100;
                lobby[a].flag[a] = (v, lobby) => {
                    lobby[v].health[a] = -1;
                    events[a][Date.now()] = 'You shot someone who visited you!';
                };
            }
            break;
        default:
    }
}
//# sourceMappingURL=logic.js.map