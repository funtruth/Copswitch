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

            if(this.players[ this.choices[i] ].alert && this.players[i].alert != i){

                //TODO Unstoppable attack? should healing stack up?
                this.players[i].dead = true

                this.events.push([
                    {message: Defaults.shotBySoldier, place: i},
                    {message: Defaults.shotWithSoldier, place: this.choices[i]},
                ])
                
            }

            //If role has a proc tag ...  
            if( Roles[ this.players[i].roleid ].proc ){

                // ... search for proc tag on target and run corresponding code
                this.proc(
                    this.players[i].roleid, //roleid
                    ( this.players[ this.choices[i] ] )[ Roles[ this.players[i].roleid ].proc ], //proc
                    i, //place
                    this.players[i], //player
                    this.choices[i] //choice
                )

            }

        }

    }

    proc(roleid, proc, i, player, choice){

        switch(roleid){

            case 'a':
                this.events.push(
                    {message: Defaults.gettingRole_ + Role[player.roleid].name, place: i}
                )
                break
            case 'b':
            case 'c':
            case 'd':
            case 'e':
                if(proc){

                } else {
                    this.events.push(
                        
                    )
                }
                break
            case 'l':
                this.events.push(
                    {message: Defaults.silenced, place: choice}
                )
                break
            case 'A':
                if(proc){
                    this.events.push(
                        {message: Defaults.resultsSus, place: i} 
                    )
                } else {
                    this.events.push(
                        {message: Defaults.resultsNotSus, place: i}
                    )
                }
                break
            case 'E':
                if( Roles[ this.players[ choice ].roleid ].type === 2 ){
                    this.events.push(
                        {message: Defaults.resultsNost + Roles[ this.players[ choice ].roleid ].name, place: i}
                    )
                    this.players[i].roleid = this.players[ choice ].roleid
                } else {
                    this.events.push(
                        {message: Defaults.resultsNotNost, place: i}
                    )
                }
                break
            case 'K':
                if(proc){
                    this.events.push(
                        {message: Defaults.healedByDoctor, place: choice},
                        {message: Defaults.healedYourTarget, place: i}
                    )
                }
                break
            case 'R':
                if( !player.dead ){
                    this.events.push(
                        {message: Defaults.resultsRit, place: i},
                        {message: Defaults.resultsRevived, place: choice}
                    )
                    this.players[i].dead = true
                    this.players[ choice ].dead = false
                } else {
                    this.events.push(
                        {message: Defaults.resultsNotRit, place: i}
                    )
                }
                break
            case 'S':
                if( Roles [ this.players [ choice ].roleid ].name != 'Villager' ){
                    this.events.push(
                        {message: Defaults.resultsMayor, place: i},
                        {message: Defaults.resultsDemoted, place: choice}
                    )
                } else {
                    this.events.push(
                        {message: Defaults.resultsMayor, place: i},
                    )
                }
                break

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