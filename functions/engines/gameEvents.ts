import * as db from '../common/db'
import * as _ from 'lodash'
import roles from './roles';

async function onPlayerDamaged(snap, roomId, uid) {
    let { lobby, gameState } = await db.get(`rooms/${roomId}`)
    let timestamp = Date.now()
    let defaultInfo = {
        timestamp,
        counter: gameState.counter,
    }

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
    
    let report = []
    let batch = {}
    for (var j=0; j<autopsy.length; j++) {
        switch(autopsy[j]) {
            case 'b':
            case 'c':
            case 'd':
            case 'e':
                dead && report.push(`${lobby[uid].name} was killed by the Mafia.`)
                break
            case 'H':
                dead && report.push(`${lobby[uid].name} was shot by a Hunter.`)
                break
            case 'I':
                batch[`events/${uid}/${timestamp}`] = { message: 'You were shot by a Soldier!', ...defaultInfo }
                break
            case 'K':
                damaged && (batch[`events/${uid}/${timestamp}`] = { message: 'You were healed by a Doctor!', ...defaultInfo })
                break
            case 'M':
                damaged && !dead && report.push(`${lobby[uid].name} was shot by a Hunter.`)
                break
            default:
        }
    }

    if (report.length > 0) {
        batch[`news/${timestamp}`] = {
            message: report.join(' '),
            timestamp,
            counter: gameState.counter,
        }
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
    let { lobby, gameState } = await db.get(`rooms/${roomId}`)

    if (!lobby) return
    
    let reviveNote = `${lobby[uid].name} was brought back to life!`
    let timestamp = Date.now()

    return db.update(
        `rooms/${roomId}/news/${timestamp}`,
        {
            message: reviveNote,
            timestamp,
            counter: gameState.counter
        }
    )
}

export {
    onPlayerDamaged,
    onPlayerDeath,
    onPlayerRevive,
}