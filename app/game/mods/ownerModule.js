import firebaseService from '../../firebase/firebaseService';
import firebase from '../../firebase/FirebaseController';

import randomize from 'randomatic';


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

    }

    //TODO
    //Balance check - end game

    async initGame(){

        this.roomId = await firebaseService.getRoomId()
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
            if(this.listeners[i]) {
                this.listeners[i].off()
            }
        }

    }

    passCounterInfo(phase, counter){

        this.phase = phase
        this.counter = counter

    }

    passPlayerList(list){

        this.playerList = list

        var playernum = 0;

        for(i=0;i<this.playerList.length;i++){

            this.playerList[i].key = i;

            if(!this.playerList[i].dead){
                playernum++;
            }

        }

        if(playernum === 1) this.playerNum = 1000

        this.playerNum = playernum
        this.triggerNum = ((playernum - playernum%2)/2) + 1

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

                        this.readyRef.set(ready).then(()=>{
                            //this.loadedRef.remove()
                        }).then(()=>{
                            //this.choiceRef.remove()
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

                var choiceArray = snap.val();
                var playerArray = null;
                var msgs = [];
                var gMsgs = [];
                var total = 0;

                for(i=0;i<choiceArray.length;i++){
                    if(choiceArray[i]) total++
                }

                if(this.phase == 0 && total>=this.triggerNum){

                    var flag = false;

                    for(var i=0;i<this.triggerNum;i++){

                        var count = 0;
                        var players = 0;

                        if(choiceArray[i] && choiceArray[i]!=-1){

                            for(j=0;j<this.playerNum;j++){
                                if(choiceArray[i] == choiceArray[j]){
                                    count++
                                }
                            }

                            if(count>=this.triggerNum){
                                flag = true;
                                this.roomRef.update({nominate:choiceArray[i]}).then(()=>
                                    this._globalMsg(this.playerList[choiceArray[i]].name + ' has been nominated.')
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
                        this._resetDayStatuses();
                        this._changePhase();

                    }
                    
                } else if (this.phase == 1 && total>=this.playerNum){

                    for(i=0;i<choiceArray.length;i++){
                        //ROLE BLOCKING
                        if(playerArray[i].roleid == 'E'){
                            //Add rb immunity later
                            choiceArray[choiceArray[i]] = -1
                        }
                        //KILLING
                        //TODO add cloud function to respond to player deaths
                        else if (playerArray[i].roleid == 'a' || playerArray[i].roleid == 'b'){
                            playerArray[choiceArray[i]].dead == true
                        }
                        else if (playerArray[i].roleid == 'J'){
                            playerArray[choiceArray[i]].dead == true
                        }
                        //FRAMING
                        else if (playerArray[i].roleid == 'd'){
                            playerArray[choiceArray[i]].suspicious == true
                        }
                    }

                    for(i=0;i<choiceArray.length;i++){
                        if(choiceArray[i] != -1){
                            if (playerArray[i].roleid == 'a') {

                                msgs.push([
                                    {message:'You were stabbed.',place:choiceArray[i]},
                                    {message:'You stabbed ' + playerArray[choiceArray[i]].name + '.',place:i}
                                ])

                            }

                            //Murderer 
                            else if (playerArray[i].roleid == 'b') {

                                msgs.push([
                                    {message:'You were stabbed.',place:choiceArray[i]},
                                    {message:'You stabbed ' + playerArray[choiceArray[i]].name + '.',place:i}
                                ])

                            }

                            //Schemer
                            else if (playerArray[i].roleid == 'c') {

                                msgs.push([
                                    {message:'You framed ' + playerArray[choiceArray[i]].name + '.',place:i}
                                ])

                            }

                            //Spy
                            else if (playerArray[i].roleid == 'd') {

                                msgs.push([
                                    {message: 'You spied on ' + playerArray[choiceArray[i]].name + '. They are a'
                                    + Rolesheet[playerArray[choiceArray[i]].roleid].name, place:i}
                                ])

                            }
                            //Silencer
                            else if (playerArray[i].roleid == 'f') {

                                playerArray[choiceArray[i]].status = 'volume-mute'

                                msgs.push([
                                    {message:'You were silenced.',place:choiceArray[i]},
                                    {message:'You silenced ' + playerArray[choiceArray[i]].name + '.',place:i}
                                ])

                            }
                            //Detective
                            else if (playerArray[i].roleid == 'A') {

                                msgs.push([
                                    {message: playerArray[choiceArray[i]].name + 
                                    Rolesheet[playerArray[choiceArray[i]].roleid].suspicious?
                                    ' is suspicious.':' is not suspicious', place:i}
                                ])

                            }
                            //Investigator
                            else if (playerArray[i].roleid == 'B') {
                                
                            }
                            //Villager
                            else if (playerArray[i].roleid == 'C') {

                                if(Rolesheet[playerArray[choiceArray[i]].roleid].type != 1){
                                    //TODO Promote logic
                                    playerArray[choiceArray[i]].raise += playerArray[choiceArray[i]].roleid
                                }

                                msgs.push([
                                    {message:'You learned from ' + playerArray[choiceArray[i]].name + '.',place:i}
                                ])
                            }
                            //Doctor
                            else if (playerArray[i].roleid == 'D') {
                                
                                if(playerArray[choiceArray[i]].dead){
                                    msgs.push([
                                        {message:'You were healed!',place:choiceArray[i]},
                                        {message:'You healed ' + playerArray[choiceArray[i]].name + '!',place:i}
                                    ])
                                } else {
                                    msgs.push([
                                        {message:'You visited ' + playerArray[choiceArray[i]].name + '.',place:i}
                                    ])
                                }

                            }
                            //Escort
                            else if (playerArray[i].roleid == 'E') {

                                msgs.push([
                                    {message:'You were distracted.',place:choiceArray[i]},
                                    {message:'You distracted ' + playerArray[choiceArray[i]].name + '.',place:i}
                                ])     

                            }
                            //Warden
                            else if (playerArray[i].roleid == 'G') {

                                for(j=0;j<choiceArray.length;j++){
                                    if(i!=j && choiceArray[i] == choiceArray[j]){
                                        msgs.push([
                                            {message:'Someone visited the house you were watching.',place:i},
                                        ]) 
                                    }
                                }

                            }
                            //Hunter - out of ammo
                            else if (playerArray[i].roleid == 'H') {
                                
                            }
                            //Overseer
                            else if (playerArray[i].roleid == 'I') {
                                
                            }
                            //Hunter
                            else if (playerArray[i].roleid == 'J') {
                                
                                playerArray[i].roleid = 'H'

                                msgs.push([
                                    {message:'You were shot.',place:choiceArray[i]},
                                    {message:'You shot ' + playerArray[choiceArray[i]].name + '.',place:i}
                                ])
                            }
                            //Disguiser
                            else if (playerArray[i].roleid == 'K') {
                                
                            }
                        }
                    }

                    this.listRef.update(playerArray)
                    this.eventsRef.child(this.counter).set(msgs)

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

                var choiceArray = snap.val();
                var playerArray = null;
                var msgs = [];
                var gMsgs = [];
                var total = 0;

                for(i=0;i<choiceArray.length;i++){
                    if(choiceArray[i]) total++
                }

                if(total >= this.playerNum - 1){

                    var count = 0
                    var names = []
                    var nameString = ''

                    for(var i=0; i<this.playerNum; i++){

                        if(choiceArray[i] == -1){
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
                        
                        this._resetDayStatuses();
                        
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