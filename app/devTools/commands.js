import firebase from '../firebase/FirebaseController'
import NavigationTool from '../navigation/NavigationTool'
import { AsyncStorage } from 'react-native'

const DEV_ROOM = '****'

const FAKE_ROOM = {
    '00000': { name: 'Matthew', place: '-A0'},
    '00001': { name: 'Justin', place: '-A1'},
    '00002': { name: 'Hannah', place: '-A2'},
    '00003': { name: 'Andrew', place: '-A3'},
    '00004': { name: 'Esther', place: '-A4'},
    '00005': { name: 'Tyler', place: '-A5'},
    '00006': { name: 'Mark', place: '-A6'},
    '00007': { name: 'Jacob', place: '-A7'},
    '00008': { name: 'Sally', place: '-A8'}
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
                status: 'Lobby'
            })
        }
    },
    {
        key: 'FILL_ROOM',
        buttonText: 'Fill DEV_ROOM',
        onPress: () => {
            let bundle = {}
            for (var i in FAKE_ROOM) {
                bundle[`rooms/${DEV_ROOM}/lobby/${i}/joined`] = true
                bundle[`rooms/${DEV_ROOM}/lobby/${i}/name`] = FAKE_ROOM[i].name
                bundle[`rooms/${DEV_ROOM}/place/${FAKE_ROOM[i].place}`] = i
            }
            firebase.database().ref().update(bundle)
        }
    },
    {
        key: 'FILL_ROLES',
        buttonText: 'Create Rolesheet',
        onPress: () => {
            let roleRef = firebase.database().ref(`rooms/${DEV_ROOM}/roles`)
            roleRef.set(TEST_ROLES)
        }
    },
    {
        key: 'HARD_RESET',
        buttonText: 'Reset Everything',
        onPress: () => {
            firebase.database().ref(`rooms/${DEV_ROOM}`).remove()
            AsyncStorage.removeItem('GAME-KEY')
            AsyncStorage.removeItem('LOBBY-KEY')
            NavigationTool.reset('HomeNav')
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
    }

]