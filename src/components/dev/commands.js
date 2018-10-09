import firebase from '../../app/admin'
import { persistor } from '../../redux/store'

const DEV_ROOM = '****'

const FAKE_ROOM = {
    '00000': { name: 'Matthew', uid: '00000' },
    '0000A': { name: 'Justin', uid: '0000A' },
    '0000B': { name: 'Hannah', uid: '0000B' },
    '0000F': { name: 'Andrew', uid: '0000F' },
    '00004': { name: 'Esther', uid: '00004' },
    '00005': { name: 'Tyler', uid: '00005' },
    '00123': { name: 'Mark', uid: '00123' },
    '00007': { name: 'Jacob', uid: '00007' },
    '00008': { name: 'Sally', uid: '00008' }
}

const TEST_ROLES = {
    e: 1,
    f: 2,
    A: 1,
    J: 5,
    K: 1
}

export default Commands = [
    {
        key: 'MAKE_DEV_ROOM',
        buttonText: 'Make DEV room',
        onPress: () => {
            let roomRef = firebase.database().ref('rooms')
            roomRef.child(DEV_ROOM).set({
                owner: firebase.auth().currentUser.uid,
                config: {
                    status: 'Lobby'
                }
            })
        }
    },
    {
        key: 'FILL_ROOM',
        buttonText: 'Fill DEV_ROOM',
        onPress: () => {
            let bundle = {}
            for (var i in FAKE_ROOM) {
                bundle[`rooms/${DEV_ROOM}/lobby/${i}/fullName`] = 'Test Name'
                bundle[`rooms/${DEV_ROOM}/lobby/${i}/name`] = FAKE_ROOM[i].name
                bundle[`rooms/${DEV_ROOM}/lobby/${i}/uid`] = FAKE_ROOM[i].uid
            }
            firebase.database().ref().update(bundle)
        }
    },
    {
        key: 'FILL_ROLES',
        buttonText: 'Create Rolesheet',
        onPress: () => {
            let roleRef = firebase.database().ref(`rooms/${DEV_ROOM}/config/roles`)
            roleRef.set(TEST_ROLES)
        }
    },
    {
        key: 'HARD_RESET',
        buttonText: 'Reset Everything',
        onPress: () => {
            firebase.database().ref(`rooms/${DEV_ROOM}`).remove()
            persistor.purge()
        }
    },
    {
        key: 'GET_TIME',
        buttonText: 'Whats the time dawg??',
        onPress: () => {
            let timestamp = Date.now()
            console.log('Current time:', timestamp)
            alert(timestamp)
        }
    },
    {
        key: 'testpush',
        buttonText: 'test',
        onPress: () => {
            firebase.database().ref(`rooms/${DEV_ROOM}/log`).once('value',snap=>{
                console.log('snap', snap)
                for(var i in snap.val()){
                    console.log('snap.vali', snap.val()[i])
                }
            })
        }
    },
    {
        key: 'teststuff',
        buttonText: 'test array stuff',
        onPress: () => {
            let bundle = {}
            bundle[`rooms/${DEV_ROOM}/teststuff`] = ['this', 'is', 'a', 'test']
            firebase.database().ref().update(bundle)
        }
    },

]