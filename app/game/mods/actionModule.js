import firebase from '../../firebase/FirebaseController';
import firebaseService from '../../firebase/firebaseService';

import { Roles } from '../../misc/roles.js';
import { Defaults } from '../../commands/announcerPack';

class actionModule{

    constructor(){

        this.choices = null
        this.players = null

        this.news = null
        this.events = []

    }

    clear(){

        this.choices = null
        this.players = null

        this.news = null
        this.events = null

    }

    passChoices(choices){

        this.choices = choices

    }

    passPlayers(players){

        this.players = players

    }

    prepareNight(){

        for(i=0;i<this.choices.length;i++){
        
            //TODO might need to check if this.choices[i] exists

            //TODO roleblock
            if(this.players[i].roleblock){
                
                this.choices[ this.choices[i] ] = -1
                
            }

        }

    }

    prepareRoles(){

        for(i=0;i<this.choices.length;i++){
        
            //TODO frame
            if(Roles[ this.players[i].roleid ].frame){
                
                this.players[ this.choices[i] ].sus = true

            }

            //TODO stab
            if(Roles[ this.players[i].roleid ].stab){

                this.players[ this.choices[i] ].stab = true

            }

            //TODO shoot
            if(Roles[ this.players[i].roleid ].shoot){

                this.players[ this.choices[i] ].dead = true

            }

            //TODO watched
            if(Roles[ this.players[i].roleid ].watched){
                
                this.players[ this.choices[i] ].watched = i
                
            }

            //TODO alert
            if(Roles[ this.players[i].roleid ].alert){

                if(this.choices[i] == i) this.players[ this.choices[i] ].alert = true

            }

        }

    }

    doRoles(){

        for(i=0;i<this.choices.length;i++){
        
            if(this.players[ this.choices[i] ].watched){

                

            }

            if(this.players[ this.choices[i] ].alert){


                
            }

            if(this.players[i].heal && this.players[ this.choices[i] ].dead){



            }

            if(this.players[i].heal && this.players[ this.choices[i] ].dead){

                

            }

            if(this.choices[i] == -1){

                //TODO stayingHome Message
                if(Roles[ this.players[i].roleid ].stayingHome){

                    this.events.push([
                        {message: Roles[ this.players[i].roleid ].stayingHome, place: i}
                    ])

                } else {

                    this.events.push([
                        {message: Defaults.youStayedHome, place: i}
                    ])

                }

            } else {

                //TODO delivery message
                if(Roles[ this.players[i].roleid ].deliveryMsg){

                    this.events.push([
                        {message: Roles[ this.players[i].roleid ].deliveryMsg, place: this.choices[i]}
                    ])

                }

                //TODO visiting Message
                this.events.push([
                    {message: Roles[ this.players[i].roleid ].visitingMsg, place: i}
                ])

            }

        }

    }

    uniqueAction(){



    }

    cleanUpPlayerState(){

        for(var i=0; i<this.players.length; i++){

            this.players.stab = null //etc

        }

    }

    pushToDatabase(){

        //TODO do this in one step
        firebaseService.fetchRoomRef('news').update(this.news)
        firebaseService.fetchRoomRef('events').update(this.events)
        firebaseService.fetchRoomRef('list').update(this.players)
        firebaseService.fetchRoomRef('choice').remove()

    }


}

export default new actionModule();