import * as _ from 'lodash'
import roles from './roles';
import * as helpers from '../common/helpers'

function onVote(choices, rss) {
    let ballots = {}
    let ballotCount = 0
    let news = []
    
    let playerNum = helpers.getPlayerCount(rss.lobby)
    let triggerNum = helpers.getTriggerNum(playerNum)

    for (var uid in choices){
        if (choices[uid] !== null){
            ballots[choices[uid]]++
            ballotCount++
        }
    }

    let nextCounter
    let nominate = null

    let flag = false
    for (var uid in ballots){
        if (ballots[uid] >= triggerNum) {
            flag = true
            nominate = uid
            news.push(rss.lobby[uid].name + ' has been put on trial.')
            nextCounter = rss.counter + 1
            break
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
        }
    } else if (ballotCount >= playerNum) {
        return {
            news: {
                [rss.counter]: news
            },
            counter: rss.counter + 2,
            nominate,
            choice: null,
            ready: null
        }
    }
    return null
}

function onTrial(votes, rss) {
    let iVotes = []
    let gVotes = []
    let news = []

    for (var uid in votes) {
        if (votes[uid] === 1) {
            iVotes.push(rss.lobby[uid].name)
        } else if (votes[uid] === -1) {
            gVotes.push(rss.lobby[uid].name)
        }
    }

    let nameString = ''
    if (gVotes.length === 0) {
        nameString = 'Nobody '
    } else if (gVotes.length === 1) {
        nameString = gVotes[0]
    } else {
        nameString = gVotes.join(', ')
    }
    news.push(nameString + ' voted against' + rss.lobby[rss.nominate].name + '.')

    let nextCounter
    if (gVotes.length > iVotes.length) {
        rss.lobby[rss.nominate].dead = true
        news.push(rss.lobby[rss.nominate].name + ' has been hung!')
        nextCounter = rss.counter + 1
    } else {
        news.push(rss.lobby[rss.nominate].name + ' was not hung.')
        nextCounter = rss.counter - 1
    }

    return {
        news: {
            [rss.counter]: news
        },
        lobby: rss.lobby,
        counter: nextCounter,
        nominate: null,
        choice: null,
        votes: null,
        ready: null
    }
}

function onNight(choices, rss) {
    let lobby = rss.lobby
    let events = []
    let actions = []

    //push all actions into an array with their prio
    for (var uid in lobby) {
        actions.push({
            uid,
            priority: roles[lobby[uid].roleId].priority,
        })
    }

    //shuffle order & stable sort by prio
    _.shuffle(actions)
    actions.sort((a, b) => a.priority - b.priority)

    //do all actions
    for (var i=0; i<actions.length; i++) {
        _action(actions[i].uid, rss.lobby, choices)
    }

    //clean up lobby before writing it
    for(var uid in lobby){
        lobby[uid].cause = undefined;
    }

    return {
        events: {
            [rss.counter]: events
        },
        lobby,
        choice: null,
        ready: null,
    }
}

function _action(a, lobby, choices) {
    switch(lobby[a].roleId) {
        case 'g':
        case 'Q':
            if (!roles[lobby[choices[a]].roleId].rbi) {
                choices[choices[a]] = -1
            }
            break
        case 'I':
            lobby[a].flag[a] = (v, lobby) => {
                lobby[v].health[a] = -1
            }
            break
        default:
    }
}

export {
    onVote,
    onTrial,
    onNight,
}