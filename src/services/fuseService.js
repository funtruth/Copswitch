import Fuse from 'fuse.js'
import { db } from '@services'

/*
TO USE:

1. Format searchlist properly,
   - List must be an array of objects that aren't named.
2. Specify options
3. Create new Fuse object and search
*/

const usernameFuzzySearch = (name, lobbyList) => {
    let list = []
    const uid = db.getUid()

    for (var i in lobbyList) {
        if (i !== uid) list.push(lobbyList[i])
    }
    
    let options = {
        id: 'name',
        includeScore: true,
        threshold: 0.3,
        maxPatternLength: 15,
        keys: ['name'],
    }

    fuse = new Fuse(list, options)
    let results = fuse.search(name)
    
    return results
}

export {
    usernameFuzzySearch
}