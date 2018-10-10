import * as db from '../common/db'
import * as _ from 'lodash'
import roles from './roles';

async function onPlayerDamaged(snap, roomId, uid) {
    let lobby = await db.get(`rooms/${roomId}/lobby`)

    let health = 0
    let damaged = false
    let autopsy = []

    for (var i in snap) {
        if (snap[i] < 0) {
            damaged = true
        }
        autopsy.push(lobby[i].roleId)
        health += snap[i]
    }

    let dead = health < 0
    
    let news = []
    let batch = {}
    for (var j=0; j<autopsy.length; j++) {
        switch(autopsy[j]) {
            case 'b':
            case 'c':
            case 'd':
            case 'e':
                dead && news.push(`${lobby[uid].name} was killed by the Mafia.`)
                break
            case 'H':
                dead && news.push(`${lobby[uid].name} was shot by a Hunter.`)
                break
            case 'I':
                batch[`events/${uid}/${Date.now()}`] = 'You were shot by a Soldier!'
                break
            case 'K':
                damaged && (batch[`events/${uid}/${Date.now()}`] = 'You were healed by a Doctor!')
                break
            case 'M':
                damaged && !dead && news.push(`${lobby[uid].name} was shot by a Hunter.`)
                break
            default:
        }
    }

    if (news.length > 0) {
        batch[`news/${Date.now()}`] = news.join(' ')
    } else {
        return
    }

    if (dead) {
        batch[`lobby/${uid}/dead`] = true
    }

    return db.update(
        `rooms/${roomId}`,
        batch
    )
}

/*uses
    should batchUpdate if this gets bigger
    assigning new killer
*/
async function onPlayerDeath(roomId, uid) {
    let lobby = await db.get(`rooms/${roomId}/lobby`)

    if (roles[lobby[uid].roleId].killer) {
        let _lobby = _.filter(lobby, i => roles[i.roleId].type === 1)
        let heir = _.sample(_lobby)
        heir.roleId = 'e'

        return db.update(
            `rooms/${roomId}/lobby/${heir.uid}`,
            heir
        )
    }

    return
}

async function onPlayerRevive(roomId, uid) {
    let lobby = await db.get(`rooms/${roomId}/lobby`)

    if (!lobby) return
    
    let reviveNote = `${lobby[uid].name} was brought back to life!`

    return db.update(
        `rooms/${roomId}/news`,
        {
            [Date.now()]: reviveNote,
        }
    )
}

export {
    onPlayerDamaged,
    onPlayerDeath,
    onPlayerRevive,
}