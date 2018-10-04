"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers = require("../callbacks/helpers");
function processLynching(choices, rss) {
    let ballots = {};
    let ballotCount = 0;
    let news = [];
    let playerNum = helpers.getPlayerCount(rss.lobby);
    let triggerNum = helpers.getTriggerNum(playerNum);
    //tallyBallots
    for (var uid in choices) {
        if (choices[uid] !== null) {
            ballots[choices[uid]]++;
            ballotCount++;
        }
    }
    //reocrdGuiltyVotes
    let nextCounter;
    let nominate = null;
    let flag = false;
    for (var uid in ballots) {
        if (ballots[uid] >= triggerNum) {
            flag = true;
            nominate = uid;
            news.push(rss.lobby[uid].name + ' has been put on trial.');
            nextCounter = rss.counter + 1;
            break;
        }
    }
    if (flag) {
        return {
            news: {
                [rss.counter]: news
            },
            counter: nextCounter,
            nominate,
            choice: null,
            ready: null
        };
    }
    else if (ballotCount >= playerNum) {
        return {
            news: {
                [rss.counter]: news
            },
            counter: rss.counter + 2,
            nominate,
            choice: null,
            ready: null
        };
    }
    return null;
}
exports.default = processLynching;
//# sourceMappingURL=lynching.js.map