import * as _ from 'lodash'
import roles from './roles';

const prio = ['prep', 'tag', 'do', 'haunt']

export default async function processActions(choices, rss) {
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
        _prep(actions[i].uid, rss.lobby, choices)
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

function _prep(a, lobby, choices) {
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