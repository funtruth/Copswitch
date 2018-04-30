import firebaseService from '../../firebase/firebaseService';
import firebase from '../../firebase/FirebaseController';

import randomize from 'randomatic';

class ownerModule{

    constructor(){

        this.roomId = null

        this.owner = false

        this.readyRef = null
        this.loadingRef = null

    }

    async initGame(){

        this.roomId = await firebaseService.getRoomId()

        if(!this.roomId) return

        this.readyRef = firebase.database().ref(`rooms/${this.roomId}/ready`)
        this.loadingRef = firebase.database().ref(`rooms/${this.roomId}/loading`)

    }

    ownerMode(mode){

        this.owner = mode

        if(mode){

            this.turnOnListeners()

        } else {

            this.turnOffListeners()

        }

    }

    turnOnListeners() {
        
        this.loadingListener()

    }

    turnOffListeners() {

        if(this.loadingRef) this.loadingRef.off()

    }



    loadingListener(){

        this.loadingRef.on('value',snap=>{

            if(snap.exists() && this.owner){

                if(snap.numChildren() >= this.state.playernum){

                    this.roomRef.child('nextcounter').once('value',nextcounter=>{

                        this.roomRef.update({ counter:nextcounter.val() })
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
                                this.roomRef.child('nextcounter').remove()
                            })
    
                        })

                    })

                }

            }

        })

    }



}

export default new ownerModule();