import firebase from './FirebaseController'

import { AsyncStorage } from 'react-native'
import randomize from 'randomatic';
import { Messages, Errors } from '../commands/strings';

class FirebaseService{

    constructor(){

        this.uid = null
        this.ign = null

        this.roomId = null

        //Basic
        this.roomRef = null

        //Room Info
        this.roomInfoRef = null
        this.myRoomInfoRef = null


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
        if(!firebase.auth().currentUser){
            firebase.auth().signInAnonymously()
        }
    }

    initUser(){
        firebase.auth().onAuthStateChanged( user =>{
            if(user) this.uid = user.uid
        })
    }

    initRefs(roomId){

        if(!roomId) return

        this.roomId = roomId

        //Basic
        this.roomRef = firebase.database().ref(`rooms/${roomId}`)

        //Room Info
        this.roomInfoRef = firebase.database().ref(`roomInfo/${roomId}`)
        this.myRoomInfoRef = firebase.database().ref(`roomInfo/${roomId}/lobby/${this.uid}`)

    }

    wipeRefs(){

        this.roomId = null

        //Basic
        this.roomRef = null

        //Room Info
        this.roomInfoRef = null
        this.myRoomInfoRef = null

        AsyncStorage.removeItem('ROOM-KEY')
        AsyncStorage.removeItem('GAME-KEY')

    }

    //Home
    async checkRoom(roomId){

        const roomInfo = await this.get(`roomInfo/${roomId}`)

        if(!roomInfo) return { valid: false, message : 'Invalid Room Code' }
        else if(roomInfo.status != 'Lobby') return { valid: false, message : 'Game has already Started' }
        else return { valid: true, message : 'Success!' }

    }

    joinRoom(roomId){

        this.initRefs(roomId)

        this.myRoomInfoRef.update({
            joined:true,
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
            owner: this.uid,
            status:'Lobby',
        })

        .then(()=>{
            AsyncStorage.setItem('ROOM-KEY', roomId)
        })

        this.joinRoom(roomId)
        return roomId
        
    }

    //Lobby

    fetchRoomInfoListener(path){

        return firebase.database().ref(`roomInfo/${this.roomId}/`+path)

    }

    leaveLobby(){

        this.activityLog(this.ign + Messages.LEAVE_ROOM)

        //If already left lobby, don't do anything
        if(!this.roomRef) return

        this.myRoomInfoRef.remove()

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

        this.ign = newName

        firebase.database().ref(`roomInfo/${this.roomId}/lobby/${this.uid}`).update({
            name:newName,
        })

        this.activityLog(newName + Messages.JOIN_ROOM)
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

    //In game
    fetchGameListener(path) {

        return firebase.database().ref(`rooms/${this.roomId}/` + path)

    }

}

export default new FirebaseService();