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

            //TODO roleblock immunity
            if(this.choices[i] && this.players[i].roleblock){
                
                this.choices[ this.choices[i] ] = -1
                
            }

        }

    }

    prepareRoles(){

        for(i=0;i<this.choices.length;i++){

            //If player isn't staying home AND player has a TAG ability
            if( this.choices[i] != -1 && Roles[ this.players[i].roleid ].tag ){

                //Set the tag to the player PLACE for future events
                ( this.players[ this.choices[i] ] )[ Roles[ this.players[i].roleid ].tag ] = i

            }

        }

    }

    doRoles(){

        //Possibly do these in a random order?
        for(i=0;i<this.choices.length;i++){
        
            //Checking for Tags
            if(this.players[ this.choices[i] ].watch){

                this.events.push([
                    {message: this.players[i].name + Defaults.caughtByWarden, place: this.players[i].watch},
                ])

            }

            if(this.players[ this.choices[i] ].alert){

                //TODO Unstoppable attack? should healing stack up?
                this.players[i].dead = true

                this.events.push([
                    {message: Defaults.shotBySoldier, place: i},
                    {message: Defaults.shotWithSoldier, place: this.choices[i]},
                ])
                
            }

            //Player Tags
            if(this.players[i].stab){

                if(this.players[ this.choices[i] ].heal){

                    this.events.push([
                        {message: Defaults.healedByDoctor, place: this.choices[i]},
                        {message: Defaults.healedYourTarget, place: this.players[i].heal}
                    ])


                } else {

                    this.news.push( this.players[ this.choices[i] ].name + Defaults.killedByMafia)

                }
                
            }

            if(this.players[i].shoot){

                if(this.players[ this.choices[i] ].heal){

                    this.events.push([
                        {message: Defaults.healedByDoctor, place: this.choices[i]},
                        {message: Defaults.healedYourTarget, place: this.players[i].heal}
                    ])


                } else {

                    this.news.push( this.players[ this.choices[i] ].name + Defaults.shotByHunter)

                }

            }

            //General
            if(this.choices[i] == -1){

                //TODO stayingHome Message test if this works lol
                this.events.push([
                    {message: Roles[ this.players[i].roleid ].stayingHome || Defaults.youStayedHome, place: i}
                ])


            } else {

                //TODO recipient message
                if(Roles[ this.players[i].roleid ].recipientMsg){

                    this.events.push([
                        {message: Roles[ this.players[i].roleid ].recipientMsg, place: this.choices[i]}
                    ])

                }

                //TODO visiting Message
                this.events.push([
                    {message: Roles[ this.players[i].roleid ].visitingMsg || Defaults.youVisitedTarget, place: i}
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