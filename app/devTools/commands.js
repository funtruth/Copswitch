import firebase from 'react-native-firebase'

const DEV_ROOM = 'AAAA'

const PLAYERS = [
    {name:'Michael',uid:'00000'},
    {name:'Hannah',uid:'00001'},
    {name:'Andrew',uid:'00002'},
    {name:'Esther',uid:'00003'},
    {name:'Tyler',uid:'00004'},
    {name:'Matthew',uid:'00005'},
    {name:'Jacob',uid:'00006'},
    {name:'Sally',uid:'00007'},
    {name:'Justin',uid:'00008'},
    {name:'Heather',uid:'00009'},
    {name:'Zoey',uid:'00010'},
    {name:'Samuel',uid:'00011'}
]

export default Commands = [
    {
        key: 'MAKE_DEV_ROOM',
        buttonText: 'Make DEV room',
        onPress: () => {
            let roomRef = firebase.database().ref('rooms')
            roomRef.child(DEV_ROOM).set({
                owner: firebaseService.getUid(),
                status: 'Lobby'
            })
        }
    },
    {
        key: 'ADD_PLAYER',
        buttonText: 'Add a Player',
        onPress: () => {
            alert('yo')
        }
    }
]