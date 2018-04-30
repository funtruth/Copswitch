import firebaseService from '../../firebase/firebaseService';
import firebase from '../../firebase/FirebaseController';

import randomize from 'randomatic';

class ownerModule{

    constructor(){

        this.roomId = null

        this.owner = false

        this.roomRef = null
        this.readyRef = null
        this.loadedRef = null
        this.choiceRef = null

        this.phase = null
        this.counter = null
        this.playerNum = 1000
        this.triggerNum = 1000

    }

    //TODO
    //Balance check - end game

    async initGame(){

        this.roomId = await firebaseService.getRoomId()
        if(!this.roomId) return

        this.roomRef = firebase.database().ref(`rooms/${this.roomId}`)
        this.readyRef = firebase.database().ref(`rooms/${this.roomId}/ready`)
        this.loadedRef = firebase.database().ref(`rooms/${this.roomId}/loaded`)
        this.choiceRef = firebase.database().ref(`rooms/${this.roomId}/choice`)

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

    }

    turnOffListeners() {

        if(this.loadedRef) this.loadedRef.off()
        if(this.choiceRef) this.choiceRef.off()

    }

    passCounterInfo(phase, counter){

        this.phase = phase
        this.counter = counter

    }

    updatePlayerNum(playerNum){

        this.playerNum = playerNum
        this.triggerNum = ((playerNum - playerNum%2)/2) + 1

    }

    _changePhase(change){

        this.roomRef.child('nextCounter').set(this.counter + change)
        .then(()=>{
            this.roomRef.child('ready').remove()
        })

    }

    _resetDayStatuses() {

        for(i=0;i<this.namelist.length;i++){
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

        this.loadedRef.on('value',snap=>{

            if(snap.exists()){

                if(snap.numChildren() >= this.playerNum){

                    this.roomRef.child('nextCounter').once('value',nextCounter=>{

                        this.roomRef.update({ counter:nextCounter.val() })
                        .then(()=>{
    
                            //TODO remove nextcounter ref
    
                            var ready = []
                            for(i=0;i<this.namelist.length;i++){
                                ready[i] = false
                            }
    
                            this.readyRef.set(ready).then(()=>{
                                this.loadedRef.remove()
                            }).then(()=>{
                                this.choiceRef.remove()
                                this.roomRef.child('nextCounter').remove()
                            })
    
                        })

                    })

                }

            }

        })

    }

    choiceListener(){

        this.choiceRef.on('value',snap=>{

            if(snap.exists()){

                var choiceArray = snap.val();
                var playerArray = null;
                var msgs = [];
                var gMsgs = [];
                var total = 0;

                for(i=0;i<choiceArray.length;i++){
                    if(choiceArray[i]) total++
                }

                if(this.phase == 1 && total>=this.triggerNum){

                    var flag = false;

                    for(i=0;i<this.triggerNum;i++){

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
                                    this._gMsg(this.namelist[choiceArray[i]].name + ' has been nominated.')
                                )
                            }

                            players++;
                        }

                        if(flag) break
                    }

                    if(flag){
                        this.choiceRef.remove();
                        this._changePhase(Phases[this.phase].trigger);

                    } else if(!flag && players >= this.playerNum){
                        
                        this.choiceRef.remove();
                        this._resetDayStatuses();
                        this._changePhase(Phases[this.phase].continue);
                    }
                    
                } else if (this.phase == 2 && total>=this.playerNum-1){
                
                    var count = 0;
                    var names = null;

                    for(i=0;i<this.playerNum;i++){
                        if(choiceArray[i] == -1){
                            count++
                            if(!names)  names=this.namelist[i].name
                            else        names+=', '+this.namelist[i].name
                        } else count--
                    }

                    this._gMsg((names||'Nobody') + ' voted against ' + this.namelist[this.nominate].name + '.')

                    if(count>0){
                        this.listRef.child(this.nominate).update({dead:true}).then(()=>{
                            this._changePlayerCount(false);
                        })

                        this._gMsg(this.namelist[this.nominate].name + ' was hung.')

                        if(this.namelist[this.nominate].roleid == 'a' || this.namelist[this.nominate].roleid == 'b'){

                            //TODO NEW MURDERER LOGIC

                        } 
                        
                        this._resetDayStatuses();
                        this._changePhase(Phases[this.phase].trigger)
                        
                    } else {
                        this._gMsg(this.namelist[this.nominate].name + ' was not hung.')
                        this.listRef.child(this.nominate).update({immune:true})
                        this._changePhase(Phases[this.phase].continue)
                    }
                    
                } else if (this.phase == 0 && total>=this.playerNum){

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
                    this.newsRef.child(this.counter).set(msgs)

                    this._changePhase(Phases[this.phase].continue);
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