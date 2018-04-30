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

        this.namelist = []

        //game statuses
        this.playerRoleId = null
        this.playerAlive = true

    }

    initGame(){

        this.roomId = firebaseService.getRoomId()

        this.uid = firebaseService.getUid()

        if(!this.roomId) return

        this.roomRef = firebase.database().ref(`rooms/${this.roomId}`)

        this.turnOnListeners()

    }

    wipeGame(){



    }

    setPlace(place){

        this.place = place

        this.myChoiceRef = firebase.database().ref(`rooms/${this.roomId}/choice/${place}`)
        
        this.myReadyRef = firebase.database().ref(`rooms/${this.roomId}/ready/${place}`)

    }

    selectChoice(choice){

        this.myChoiceRef.set(choice)
        
        .then(()=>{
            this.myReadyRef.set(true)
        })

    }

    turnOnListeners(){

        this.listListener()
        this.roleListener()

    }

    listListener(){

        this.listRef = firebase.database().ref(`rooms/${this.roomId}/list`)
        this.listeners.push(this.listRef)

        this.listRef.on('value',snap=>{
            if(snap.exists()){
    
                this.namelist = snap.val();
                var playernum = 0;
                var balance = 0;
                var mafialist = [];
    
                for(i=0;i<this.namelist.length;i++){
    
                    this.namelist[i].key = i;
    
                    //Generate my info
                    if(this.namelist[i].uid == this.uid){
                        
                        this.playerRoleId = this.namelist[i].roleid
                        this.playerAlive = !this.namelist[i].dead
                        this.playerMafia = Rolesheet[this.namelist[i].roleid].type == 1
                        this.playerTargetDead = Rolesheet[this.namelist[i].roleid].targetdead?true:false,
                        this.playerTargetTown = Rolesheet[this.namelist[i].roleid].targettown?true:false,
        
                        this.setPlace(i)

                    }
    
                    //Mafialist
                    if(Rolesheet[this.namelist[i].roleid].type == 1 && this.namelist[i].uid != this.user){
                        mafialist.push({
                            name:       this.namelist[i].name,
                            rolename:   Rolesheet[this.namelist[i].roleid].name,
                            dead:       this.namelist[i].dead,
                            key:        i,
                        })
                    }
    
                    //player number and trigger number + gamestate
                    if(!this.namelist[i].dead){
    
                        playernum++;
    
                        if(Rolesheet[this.namelist[i].roleid].type == 1){
                            balance--;
                        } else {
                            balance++;
                        }
                    }
                }
    
                this.myReadyRef.on('value',readysnap=>{
    
                    if(readysnap.exists()){
                        
                        //this.setState({ ready:readysnap.val(), section:readysnap.val() })
            
                    } else {
            
                        //this.setState({ ready:null, section:null })
            
                        //TODO PERFORM ACTIONS HERE BEFORE SUBMITTING TRUE
            
                        setTimeout(()=>{
                            this.myReadyRef.once('value',snap=>{
                                if(snap.exists()){
                                    this.myReadyRef.remove();
                                } else {
                                    //this.loadedRef.child(this.user).set(true)
                                }
                            })
                        },1500)
                    }
                })
    
                /*this.setState({
                    playernum:      playernum,
                    triggernum:     ((playernum - playernum%2)/2)+1,
                    gameover:       balance == playernum || balance <= 0,
    
                    mafialist:      mafialist,
                })*/
            }
        })

    }
    
    roleListener(){

        this.roleRef = firebase.database().ref(`rooms/${this.roomId}/list/${this.place}/role`)
        this.listeners.push(this.roleRef)

        this.roleRef.on('value',snap=>{



        })

    }

    turnOffListeners(){

        for(var i=0; i<this.listeners.length; i++){

            if(this.listeners[i]) {
                this.listeners[i].off()
            }

        }

    }

}

export default new playerModule();