import firebase from '../../firebase/FirebaseController';
import firebaseService from '../../firebase/firebaseService';

import Rolesheet from '../../misc/roles.json'

class playerModule{

    constructor(){

        this.roomId = null

        this.uid = null

        this.ign = null

        this.place = null

        this.roomRef = null

        this.listeners = []

        this.myChoiceRef = null
        this.myReadyRef = null
        this.myInfoRef = null

        this.namelist = []

        //game statuses
        this.playerRoleId = null
        this.playerAlive = true

    }

    async initGame(){

        this.roomId = firebaseService.getRoomId()
        if(!this.roomId) return

        this.roomRef = firebase.database().ref(`rooms/${this.roomId}`)

        this.uid = firebaseService.getUid()
        this.setPlace( await firebaseService.getRoomInfoPlace() )

        this.turnOnListeners()

    }

    wipeGame(){

        this.turnOffListeners()

        this.roomId = null

        this.uid = null
        this.ign = null
        this.place = null

        this.roomRef = null

        this.listeners = []

        this.myChoiceRef = null
        this.myReadyRef = null
        this.myInfoRef = null

        this.namelist = []

        //game statuses
        this.playerRoleId = null
        this.playerAlive = true

    }

    setPlace(place){

        this.place = place

        this.myChoiceRef = firebase.database().ref(`rooms/${this.roomId}/choice/${place}`)
        this.myReadyRef = firebase.database().ref(`rooms/${this.roomId}/ready/${place}`)
        this.myLoadedRef = firebase.database().ref(`rooms/${this.roomId}/loaded${this.uid}`)
        this.myInfoRef = firebase.database().ref(`rooms/${this.roomId}/list/${place}`)

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

    turnOnListeners(){

        this.myInfoListener()

    }

    
    myInfoListener(){

        this.listeners.push(this.myInfoRef)
        
        this.myInfoRef.on('value',snap=>{

            this.playerRoleId = snap.val().roleid
            this.playerAlive = !snap.val().dead
            this.playerMafia = Rolesheet[snap.val().roleid].type == 1
            this.playerTargetDead = Rolesheet[snap.val().roleid].targetdead?true:false,
            this.playerTargetTown = Rolesheet[snap.val().roleid].targettown?true:false

        })

    }

    turnOffListeners(){

        for(var i=0; i<this.listeners.length; i++){
            if(this.listeners[i]) {
                this.listeners[i].off()
            }
        }

    }

    fetchGameRef(path){

        return firebase.database().ref(`rooms/${this.roomId}/` + path)

    }

    fetchMyReadyRef(){

        return firebase.database().ref(`rooms/${this.roomId}/ready/${this.place}`)

    }

}

export default new playerModule();