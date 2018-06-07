import firebaseService from '../firebase/firebaseService'

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
    MAKE_DEV_ROOM = {
        button: 'Make DEV room'
    },
    ADD_PLAYER = {
        button: 'Add a Player',
        function: () => firebaseService.get()
    }
]