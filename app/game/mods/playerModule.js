import firebase from '../../firebase/FirebaseController';
import firebaseService from '../../firebase/firebaseService';

import { Roles } from '../../misc/roles.js';
import ownerModule from './ownerModule';

class playerModule{

    constructor(){

        this.roomId = null
        this.listeners = []

        this.uid = null
        this.ign = null
        this.place = null

        this.myChoiceRef = null
        this.myReadyRef = null
        this.myInfoRef = null
        this.myLoadedRef = null

        //game statuses
        this.playerRoleId = null
        this.playerAlive = true

        this.playerList = []

    }

    async initGame(){

        this.roomId = firebaseService.getRoomId()
        if(!this.roomId) return

        this.uid = firebaseService.getUid()
        this.place = await this.getRoomInfoPlace()
        this.setPlace(this.place)

        this.turnOnListeners()

    }

    getRoomInfoPlace(){
        
        return new Promise (resolve => {

            const ref = firebaseService.fetchRoomInfoRef('place')
            ref.once('value',snap => {
            
                if(!snap) resolve()

                var counter = 0
    
                snap.forEach((child)=>{
                    if(child.val() === this.uid){
                        this.place = counter
                    }
                    counter++
                })

                resolve(this.place)
            })

        })

    }

    wipeGame(){

        this.turnOffListeners()
        this.listeners = []

        this.roomId = null

        this.uid = null
        this.ign = null
        this.place = null

        this.myChoiceRef = null
        this.myReadyRef = null
        this.myInfoRef = null
        this.myLoadedRef = null

        //game statuses
        this.playerRoleId = null
        this.playerAlive = true

        this.playerList = []

    }

    setPlace(place){

        this.place = place

        this.myChoiceRef = firebase.database().ref(`rooms/${this.roomId}/choice/${place}`)
        this.myReadyRef = firebase.database().ref(`rooms/${this.roomId}/ready/${place}`)
        this.myInfoRef = firebase.database().ref(`rooms/${this.roomId}/list/${place}`)
        this.myLoadedRef = firebase.database().ref(`rooms/${this.roomId}/loaded/${this.uid}`)

    }

    turnOnListeners(){

        this.myInfoListener()

    }

    
    myInfoListener(){

        this.listeners.push(this.myInfoRef)
        
        this.myInfoRef.on('value',snap=>{

            this.playerRoleId = snap.val().roleid
            this.playerAlive = !snap.val().dead
            this.playerMafia = Roles[snap.val().roleid].type == 1
            this.playerTargetDead = Roles[snap.val().roleid].targetdead?true:false,
            this.playerTargetTown = Roles[snap.val().roleid].targettown?true:false

        })

    }

    passPlayerList(list){

        this.playerList = list

    }

    getUserNameUsingPlace(place){

        return this.playerList[place].name

    }

    

    turnOffListeners(){

        for(var i=0; i<this.listeners.length; i++){
            if(this.listeners[i]) {
                this.listeners[i].off()
            }
        }

    }

    fetchMyReadyRef(){

        return firebase.database().ref(`rooms/${this.roomId}/ready/${this.place}`)

    }

    selectChoice(choice){

        this.myChoiceRef.set(choice)
        
        .then(()=>{
            this.myReadyRef.set(choice?true:false)
        })

    }

    loaded(){

        this.myLoadedRef.set(true)

    }

    notification(message){
        //TODO
    }

    publishNews(message){



    }

}

export default new playerModule();