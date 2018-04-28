import firebase from './FirebaseController'

import { AsyncStorage } from 'react-native'
import randomize from 'randomatic';
import { Messages, Errors } from '../commands/strings';

class FirebaseService{

    constructor(){

        this.uid = null
        this.ign = null

        this.roomId = null

        //Basic refs
        this.roomRef = null
        this.roomInfoRef = null
        this.roomInfoRolesRef = null
        this.myRoomInfoRef = null

        //Lobby refs
        this.roomInfoLobbyRef = null
        this.roomInfoLogRef = null
        this.roomInfoOwnerRef = null
        this.roomInfoStatusRef = null

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

    //Loading
    findUser() {
        if(!firebase.auth().currentUser){
            firebase.auth().signInAnonymously()
        }
    }

    initUser(){
        firebase.auth().onAuthStateChanged( user =>{
            if(user) this.uid = user.uid
        })
    }

    initRoom(roomId){

        this.roomId = roomId

        this.roomRef = firebase.database().ref(`rooms/${roomId}`)

        this.myRoomInfoRef = firebase.database().ref(`roomInfo/${roomId}/lobby/${this.uid}`)

        this.roomInfoRef = firebase.database().ref(`roomInfo/${roomId}`)
        this.roomInfoRolesRef = firebase.database().ref(`roomInfo/${roomId}/roles`)

        this.roomInfoLobbyRef = firebase.database().ref(`roomInfo/${this.roomId}/lobby`)
        this.roomInfoLogRef = firebase.database().ref(`roomInfo/${this.roomId}/log`)
        this.roomInfoOwnerRef = firebase.database().ref(`roomInfo/${this.roomId}/owner`)
        this.roomInfoStatusRef = firebase.database().ref(`roomInfo/${this.roomId}/status`)

    }

    //Home
    async checkRoom(roomId){

        const roomInfo = await this.get(`roomInfo/${roomId}`)

        if(!roomInfo) return { valid: false, message : 'Invalid Room Code' }
        else if(roomInfo.status != 'Lobby') return { valid: false, message : 'Game has already Started' }
        else return { valid: true, message : 'Success!' }

    }

    joinRoom(roomId){

        this.initRoom(roomId)

        firebase.database().ref(`roomInfo/${this.roomId}/lobby/${this.uid}`).set({
            name:'placeholder',
        })

    }

    async createRoom(){
        
        const allRoomInfo = await this.get(`roomInfo`)

        var flag = false
        var roomId = null

        while(!flag){
            roomId = randomize('0',4);
            if(!allRoomInfo) flag = true
            else if(!allRoomInfo[roomId]) flag = true
        }
        
        firebase.database().ref(`roomInfo/${roomId}`).set({
            owner: firebase.auth().currentUser.uid,
            status:'Lobby',
        })

        .then(()=>{
            AsyncStorage.setItem('ROOM-KEY', roomId)
        })

        this.joinRoom(roomId)
        return roomId
        
    }

    //Lobby
    fetchLobbyListeners(){

        return {
            roomId: this.roomId,
            ownerRef: this.roomInfoOwnerRef,
            myInfoRef: this.myRoomInfoRef,
            logRef: this.roomInfoLogRef,
            statusRef: this.roomInfoStatusRef,
        }

    }

    leaveLobby(){

        this.activityLog(this.ign + Messages.LEAVE_ROOM)

        //If already left lobby, don't do anything
        if(!this.roomRef) return

        this.myRoomInfoRef.remove()

        this.roomId = null

        this.roomRef = null
        this.roomInfoRef = null
        this.myRoomInfoRef = null

    }

    deleteRoom() {

        this.activityLog(this.ign + Messages.DELETE_ROOM)

        //If already left lobby, don't do anything
        if(!this.roomRef) return

        this.roomRef.remove()

        this.roomId = null

        this.roomRef = null
        this.roomInfoRef = null
        this.myRoomInfoRef = null

    }

    updateUsername(newName){

        this.ign = newName

        firebase.database().ref(`roomInfo/${this.roomId}/lobby/${this.uid}`).set({
            name:newName,
        })

        this.activityLog(newName + Messages.JOIN_ROOM)
    }

    activityLog(message){
        firebase.database().ref(`roomInfo/${this.roomId}/log`).push(message)
    }

    changeRoleCount(key,change){
        this.roomInfoRolesRef.child(key).transaction(count=>{
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

            this.roomRef.child('list').set(listshot)
                .then(()=>{ 
                    this.roomRef.child('ready').set(readyshot) 
                })
                    .then(()=>{ 
                        this.roomInfoRef.child('status').set('Starting') 
                    })

        }

    }

}

export default new FirebaseService();