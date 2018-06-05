import firebase from './FirebaseController'

import { AsyncStorage } from 'react-native'

import randomize from 'randomatic'
import { Messages, Errors } from '../commands/strings'

class FirebaseService{

    constructor(){

        this.uid = null
        this.pushKey = null //push key upon entering room

        this.roomId = null
        this.roomRef = null
        this.myInfoRef = null
        this.placeRef = null

    }

    //General
    get(path){
        return firebase.database().ref(path).once('value').then(snap => {
            return snap.val();
        });
    }
    getSnap(path){
        return firebase.database().ref(path).once('value').then(snap => {
            return snap;
        });
    }

    //Fetch
    getUid(){
        return this.uid
    }

    getRoomId(){
        return this.roomId
    }

    //TODO test how well this works 
    initUser(){
        firebase.auth().onAuthStateChanged( user =>{
            if(user){
                this.uid = user.uid
            } else {
                firebase.auth().signInAnonymously()
                    .then(user => alert(user.uid))
            }
        })
    }

    wipeRefs(){

        this.roomId = null
        this.roomRef = null

        this.myInfoRef = null
        this.placeRef = null

        AsyncStorage.removeItem('LOBBY-KEY')
        AsyncStorage.removeItem('GAME-KEY')

    }

    joinRoom(roomId){
        if(!roomId) return

        this.roomId = roomId
        this.roomRef = firebase.database().ref(`rooms/${roomId}`)

        this.myInfoRef = firebase.database().ref(`rooms/${roomId}/lobby/${this.uid}`)
        this.placeRef = firebase.database().ref(`rooms/${roomId}/place`)

        this.myInfoRef.update({
            joined:true,
        })
    }

    addPushKey(){
        this.pushKey = this.placeRef.push().key
        this.placeRef.child(this.pushKey).set(this.uid)
    }

    removePushKey(){
        this.placeRef.child(this.pushKey).remove()
    }

    fetchRoomRef(path){
        return firebase.database().ref(`rooms/${this.roomId}/${path}`)
    }

    leaveLobby(username){

        this.activityLog(username + Messages.LEAVE_ROOM)

        //If already left lobby, don't do anything
        if(!this.roomRef) return

        this.myInfoRef.remove()
        this.removePushKey()

        this.wipeRefs()

    }

    deleteRoom() {

        this.activityLog(Messages.DELETE_ROOM)

        //If already left lobby, don't do anything
        if(!this.roomRef) return

        this.roomRef.remove()

        this.wipeRefs()

    }

    updateUsername(newName){

        firebase.database().ref(`rooms/${this.roomId}/lobby/${this.uid}`).update({
            name:newName,
        })

        this.activityLog(newName + Messages.UPDATE_NAME)
    }

    activityLog(message){
        firebase.database().ref(`rooms/${this.roomId}/log`).push(message)
    }

    changeRoleCount(key,change){
        this.roomRef.child('roles').child(key).transaction(count=>{
            return change?count+1:count-1
        })
    }

}

export default new FirebaseService();