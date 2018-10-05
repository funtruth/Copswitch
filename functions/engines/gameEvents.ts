import * as db from '../callbacks/db'
import * as _ from 'lodash'
import roles from './roles';

async function onPlayerDamaged(snap, roomId, uid) {

}

/*uses
    should batchUpdate if this gets bigger
    assigning new killer
*/
async function onPlayerDeath(roomId, uid) {
    let lobby = await db.get(`rooms/${roomId}/lobby`)

    if (roles[lobby[uid].roleId].killer) {
        let lobbyDupe = _.filter(lobby, i => roles[i.roleId].type === 1)
        let heir = _.sample(lobbyDupe)
        heir.roleId = 'e'

        return db.update(
            `rooms/${roomId}/lobby/${heir.uid}`,
            heir
        )
    }
}

export {
    onPlayerDamaged,
    onPlayerDeath,
}