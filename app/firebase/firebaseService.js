import firebase from './FirebaseController'

import { AsyncStorage } from 'react-native'
import randomize from 'randomatic'
import { Messages, Errors } from '../commands/strings'

import { newLobbyInfo } from '../lobby/LobbyReducer'

class FirebaseService{

    constructor(){

        this.uid = null
        this.pushKey = null //push key upon entering room

        this.roomId = null
        this.roomInfoRef = null
        this.roomRef = null

        this.myRoomInfoRef = null
        this.placeRef = null
        this.lobbyListeners = []

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

    //Loading
    findUser() {
        console.log('current user', firebase.auth().currentUser)
        if(!firebase.auth().currentUser){
            firebase.auth().signInAnonymously()
            console.log('New user created.')
        }
    }

    initUser(){
        firebase.auth().onAuthStateChanged( user =>{
            if(user) this.uid = user.uid
            console.log('User is ' + user.uid)
        })
    }

    initRefs(roomId){
        if(!roomId) return

        this.roomId = roomId
        this.roomInfoRef = firebase.database().ref(`roomInfo/${roomId}`)
        this.roomRef = firebase.database().ref(`rooms/${roomId}`)

        this.myRoomInfoRef = firebase.database().ref(`roomInfo/${roomId}/lobby/${this.uid}`)
        this.placeRef = firebase.database().ref(`roomInfo/${roomId}/place`)
    }

    wipeRefs(){

        this.roomId = null
        this.roomRef = null
        this.roomInfoRef = null

        this.myRoomInfoRef = null
        this.placeRef = null

        AsyncStorage.removeItem('ROOM-KEY')
        AsyncStorage.removeItem('GAME-KEY')

    }

    joinRoom(roomId){
        this.addPushKey()

        this.myRoomInfoRef.update({
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

    fetchRoomInfoRef(path){
        return firebase.database().ref(`roomInfo/${this.roomId}/${path}`)
    }

    fetchRoomRef(path){
        return firebase.database().ref(`rooms/${this.roomId}/${path}`)
    }

    turnOnLobbyListeners(){
        this.lobbyListenerOn('owner','owner','value')
        this.lobbyListenerOn('name',`lobby/${this.uid}`,'value')
        this.lobbyListenerOn('log','log','child_added')
        this.lobbyListenerOn('roles','roles','value')
        this.lobbyListenerOn('status','status','value')
    }

    lobbyListenerOn(listener,listenerPath,listenerType){
        let listenerRef = firebase.database().ref(`roomInfo/${this.roomId}/${listenerPath}`)
        this.lobbyListeners.push(listenerRef)
        listenerRef.on(listenerType, snap => {
            newLobbyInfo(snap, listener)
        })
    }

    lobbyListenerOff(){
        for(var i=0; i<this.lobbyListeners; i++){
            this.lobbyListeners[i].off()
        }
        this.lobbyListeners = null
    }

    leaveLobby(username){

        this.activityLog(username + Messages.LEAVE_ROOM)

        //If already left lobby, don't do anything
        if(!this.roomRef) return

        this.myRoomInfoRef.remove()
        this.removePushKey()

        this.wipeRefs()

    }

    deleteRoom() {

        this.activityLog(Messages.DELETE_ROOM)

        //If already left lobby, don't do anything
        if(!this.roomRef) return

        this.roomInfoRef.remove()

        this.wipeRefs()

    }

    updateUsername(newName){

        firebase.database().ref(`roomInfo/${this.roomId}/lobby/${this.uid}`).update({
            name:newName,
        })

        this.activityLog(newName + Messages.UPDATE_NAME)
    }

    activityLog(message){
        firebase.database().ref(`roomInfo/${this.roomId}/log`).push(message)
    }

    changeRoleCount(key,change){
        this.roomInfoRef.child('roles').child(key).transaction(count=>{
            return change?count+1:count-1
        })
    }

    async startGame(){

        var randomstring = '';
        const roomInfo = await this.getSnap(`roomInfo/${this.roomId}`)

        roomInfo.child('roles').forEach((child)=>{
            for(i=0;i<child.val();i++){
                randomstring += randomize('?', 1, {chars: child.key})
            }
        })

        if(roomInfo.child('lobby').numChildren() != randomstring.length){

            this.activityLog('Improper set-up')
        
        } else {

            //TODO algorithm
            var rng = 0

            var count = 0
            var listshot = []
            var readyshot = []

            roomInfo.child('lobby').forEach((child)=>{

                rng = Math.floor(Math.random() * randomstring.length);

                listshot.push({
                    name: child.val().name,
                    uid: child.key,
                    roleid: randomstring.charAt(rng)
                })
                readyshot.push(false)
                count++

                randomstring = randomstring.slice(0,rng) + randomstring.slice(rng+1)
                
            })

            //Set-up more safely
            this.roomRef.child('list').set(listshot)
            .then(()=>{ 
                this.roomRef.child('ready').set(readyshot) 
            })
            .then(()=>{ 
                this.roomRef.update({
                    counter: 3
                }) 
            })
            .then(()=>{ 
                this.roomInfoRef.child('status').set('Starting') 
            })


        }

    }

}

export default new FirebaseService();