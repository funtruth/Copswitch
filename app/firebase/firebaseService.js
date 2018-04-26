import firebase from './FirebaseController'

import { AsyncStorage } from 'react-native'

class FirebaseService{

    constructor(){

        this.uid = null

        this.roomname = null

    }

    findUser() {
        if(!firebase.auth().currentUser){
            firebase.auth().signInAnonymously()
        }
    }

    getRoom() {
        return this.roomname
    }

    createRoom(roomname) {
        this.roomname = roomname
    }


}

export default new FirebaseService();