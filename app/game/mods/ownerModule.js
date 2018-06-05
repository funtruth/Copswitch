import firebaseService from '../../firebase/firebaseService';
import firebase from '../../firebase/FirebaseController';

import actionModule from './actionModule';

class ownerModule{

    constructor(){
        this.roomId = null

        this.owner = false

        this.roomRef = null
        this.readyRef = null
        this.counterRef = null

        this.listRef = null
        this.logRef = null
        this.eventsRef = null

        this.listeners = []

        this.phase = null
        this.counter = null
        this.playerNum = 1000
        this.triggerNum = 1000

        this.playerList = []
        this.nominate = null
    }

    //TODO
    //Balance check - end game

    initOwnerRefs(){
        this.roomId = firebaseService.getRoomId()
        if(!this.roomId) return

        this.roomRef = firebase.database().ref(`rooms/${this.roomId}`)
        this.readyRef = firebase.database().ref(`rooms/${this.roomId}/ready`)
        this.counterRef = firebase.database().ref(`rooms/${this.roomId}/counter`)

        this.listRef = firebase.database().ref(`rooms/${this.roomId}/list`)
        this.logRef = firebase.database().ref(`rooms/${this.roomId}/log`)
        this.eventsRef = firebase.database().ref(`rooms/${this.roomId}/events`)
    }

    wipeGame(){

    }

    ownerMode(mode){
        this.owner = mode

        if(mode) this.turnOnListeners()
        else this.turnOffListeners()
    }

    turnOnListeners() {
        this.loadedListener()
        this.choiceListener()
        this.voteListener()
    }

    turnOffListeners() {
        for(var i=0; i<this.listeners.length; i++){
            this.listeners[i].off()
        }
    }

    passCounterInfo(phase, counter){

        this.phase = phase
        this.counter = counter

    }

    passPlayerList(list){
        this.playerList = list
        var alive = 0;

        for(i=0;i<this.playerList.length;i++){
            this.playerList[i].key = i;

            if(!this.playerList[i].dead){
                alive++;
            }
        }
        this.playerNum = alive
        this.triggerNum = ((alive - alive%2)/2) + 1
    }

    _changePhase(){
        this.roomRef.child('ready').remove()
    }

    _resetDayStatuses() {

        for(i=0;i<this.playerList.length;i++){
            this.listRef.child(i).update({
                immune:null,
                status:null,
                suspicious:null
            })
        }
    
    }

    _globalMsg(message){
        this.roomRef.child('log').push(message)
    }

    loadedListener(){
        
        const ref = firebaseService.fetchRoomRef('loaded')
        this.listeners.push(ref)

        ref.on('value',snap=>{

            if(snap.exists()){

                if(snap.numChildren() >= this.playerNum){

                    this.counterRef.update(this.counter + 1)
                    .then(()=>{
                        
                        var ready = []
                        for(i=0;i<this.playerList.length;i++){
                            ready[i] = false
                        }

                        this.roomRef.update({
                            ready: {ready},
                            loaded: null,
                            choice: null
                        })

                    })

                    

                }

            }

        })

    }

    choiceListener(){

        const ref = firebaseService.fetchRoomRef('choice')
        this.listeners.push(ref)

        ref.on('value',snap=>{

            if(snap.exists()){

                var total = 0;

                for(i=0;i<snap.val().length;i++){
                    if(snap.val()[i]) total++
                }

                if(this.phase == 0 && total>=this.triggerNum){

                    var flag = false;

                    for(var i=0;i<this.triggerNum;i++){

                        var count = 0;
                        var players = 0;

                        if(snap.val()[i] && snap.val()[i]!=-1){

                            for(j=0;j<this.playerNum;j++){
                                if(snap.val()[i] == snap.val()[j]){
                                    count++
                                }
                            }

                            if(count>=this.triggerNum){
                                flag = true
                                this.roomRef.update({nominate:snap.val()[i]}).then(()=>
                                    this._globalMsg(this.playerList[snap.val()[i]].name + ' has been nominated.')
                                )
                            }

                            players++;
                        }

                        if(flag) break

                    }

                    if(flag){

                        ref.remove();

                    } else if(!flag && players >= this.playerNum){
                        
                        ref.remove();
                        //this._resetDayStatuses();
                        this._changePhase();

                    }
                    
                } else if (this.phase == 1 && total>=this.playerNum){

                    actionModule.clear()

                    actionModule.passChoices(snap.val())
                    actionModule.passPlayers(this.playerList)
                    actionModule.updateAlive()

                    actionModule.prepareNight()
                    actionModule.shuffle()
                    actionModule.prepareRoles()
                    actionModule.doNight()
                    actionModule.postMortem()

                    actionModule.cleanUpPlayerState()
                    actionModule.checkNews()
                    actionModule.pushToDatabase()

                    //TODO wait for a promise or somehitng
                    this._changePhase();
                }
            }
        })
    }

    voteListener(){

        const ref = firebaseService.fetchRoomRef('vote')
        this.listeners.push(ref)

        ref.on('value',snap=>{

            if(snap.exists()){

                var total = 0;

                for(i=0;i<snap.val().length;i++){
                    if(snap.val()[i]) total++
                }

                if(total >= this.playerNum - 1){

                    var count = 0
                    var names = []
                    var nameString = ''

                    for(var i=0; i<this.playerNum; i++){

                        if(snap.val()[i] == -1){
                            names.push(this.playerList[i].name)
                            count++
                        } else {
                            count--
                        }

                    }

                    for(var i=0; i<names.length; i++){

                        nameString += names[i]

                    }

                    this._globalMsg((nameString || 'Nobody') + ' voted against ' + this.playerList[this.nominate].name + '.')

                    if(count>0){

                        firebaseService.fetchRoomRef('list').child(this.nominate).update({dead:true})

                        this._globalMsg(this.playerList[this.nominate].name + ' was hung.')

                        if(this.playerList[this.nominate].roleid == 'a' || this.playerList[this.nominate].roleid == 'b'){

                            //TODO NEW MURDERER LOGIC

                        } 
                        
                    } else {

                        this._globalMsg(this.playerList[this.nominate].name + ' was not hung.')
                        firebaseService.fetchRoomRef('nominate').remove()

                    }

                }

            }

        })

    }

    gameOver(){

        if(owner){
            this.roomRef.remove()
            firebaseService.deleteRoom()
        }

        this.wipeGame()

    }

}

export default new ownerModule();