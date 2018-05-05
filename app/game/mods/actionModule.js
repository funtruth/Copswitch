import firebaseService from '../../firebase/firebaseService';

import { Roles } from '../../misc/roles.js';
import { Defaults } from '../../commands/announcerPack';

class actionModule{

    constructor(){

        this.choices = null
        this.players = null

        this.news = []
        this.alive = []
        this.events = []

    }

    clear(){

        this.choices = null
        this.players = null

        this.news = []
        this.alive = []
        this.events = []

    }

    passChoices(choices){

        this.choices = choices

    }

    passPlayers(players){

        this.players = players

    }

    updateAlive(){

        for(var i=0; i<this.players.length; i++){

            if(!this.players.dead) this.alive.push(i)

        }

    }

    prepareNight(){

        for(i=0;i<this.choices.length;i++){

            //TODO does this work for each night phase?
            while(this.choices[i]) i++

            //Roleblockers are immune to roleblock - they should have a proc : 'roleblock' as well
            if(this.choices[i] && this.players[i].roleblock && !this.players[ this.choice[i] ].roleblock){
                
                this.choices[ this.choices[i] ] = -1
                
            }

        }

    }

    prepareRoles(){

        for(i=0;i<this.choices.length;i++){

            //If player isn't staying home AND player has a TAG ability
            if( this.choices[i] != -1 && Roles[ this.players[i].roleid ].tag ){

                //Set the tag to the player PLACE for future events
                //TODO check how push acts : need this to stack tags
                ( this.players[ this.choices[i] ] )[ Roles[ this.players[i].roleid ].tag ].push(i)

            }

        }

    }

    doRoles(){

        //Possibly do these in a random order?
        for(i=0;i<this.choices.length;i++){
        
            //Checking for Tags
            //TODO can I store all the LFTags in an array?
            if(this.players[ this.choices[i] ].watch){

                this.events.push([
                    {message: this.players[i].name + Defaults._seenByWarden, place: this.players[i].watch},
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

            //Handle deaths better
            if(this.players[i].proc){

                this.events.push(
                    Roles[ this.players[i].roleid ].proc( 
                        this.players[i],
                        i,
                        this.choices[i],
                        (this.players[ this.choices[i] ])[this.players[i].proc]
                    )
                )

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

    postMortem(){

        for(i=0;i<this.choices.length;i++){

            //If player has a POSTMORTEM ability -> after alive check is done
            if( Roles[ this.players[i].roleid ].mortem ){

                //Private
                //Survivor
                //Any player with Prayer tag given by Priest
                //Ritualist -> if survived

            }

        }

    }

    uniqueAction(){

        

    }

    cleanUpPlayerState(){

        for(var i=0; i<this.players.length; i++){

            this.players.heal = null //etc

        }

    }

    checkNews(){

        for(var i=0; i<this.alive.length; i++){

            if(this.players[ this.alive[i] ].dead){

                this.news.push(
                    this.players[ this.alive[i] ].name + Defaults._died
                )

            }

        }

    }

    pushToDatabase(){

        firebaseService.fetchRoomRef('').update({
            news: this.news,
            events: this.events,
            list: this.players,
            choice: null
        })
        
    }


}

export default new actionModule();