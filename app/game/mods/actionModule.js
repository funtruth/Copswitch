import firebaseService from '../../firebase/firebaseService';

import { Roles } from '../../misc/roles.js';
import { Defaults } from '../../commands/announcerPack';

const s = ','

class actionModule{

    constructor(){
        this.choices = []
        this.players = []

        this.order = []
        this.lifeStatus = []
        this.news = []
        this.events = []
    }

    clear(){
        this.choices = []
        this.players = []

        this.order = []
        this.lifeStatus = []
        this.news = []
        this.events = []
    }

    passChoices(choices){
        this.choices = choices
    }

    passPlayers(players){
        this.players = players
    }

    /*
    To compare with at the end for NEWS
    does NOT refer to ORDER in case a player is RESSED
    */
    updateAlive(){
        for(var i=0; i<this.players.length; i++){
            this.lifeStatus.push({i:!this.players[i].dead})
        }
    }

    /*
    anything that will affect whether or not a TAG will exist:
    a player will not be able to TAG if they are roleblocked.
    a player will receive a DEAD TAG if they visit an alerted player.
    */
    prepareNight(){
        for(i=0;i<this.choices.length;i++){
            while(!this.choices[i]) i++

            let role = Roles[this.players[i].roleid]

            //Roleblockers are immune to roleblock - they should have a proc : 'roleblock' as well
            if(role.roleblock && !this.players[this.choice[i]].roleblock){
                this.choices[this.choices[i]] = -1
            }

            //Alert is done in prep phase to correctly set DEAD tags
            if(role.alert && this.choices[i] !== -1){
                this.players[i].alert = i
            }
        }
    }
    
    //Removes unnecessary actions and SHUFFLES the order in which roles are performed
    shuffle() {
        //Removes NULL and -1 values from visit choices
        for(var i=0; i<this.choices.length; i++){
            if(this.choices[i] && this.choices[i] !== -1) this.order.push(i)
        }

        //Fisher-Yates Shuffle
        let counter = this.order.length;

        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);

            counter--;

            let temp = this.order[counter];
            this.order[counter] = this.order[index];
            this.order[index] = temp;
        }
    }

    /*
    sets all the TAGS for future interaction
    If a role requires interactions between roles / players, it must be set-up here or earlier
    */
    prepareRoles(){
        for(i=0;i<this.order.length;i++){
            let actor = this.order[i]
            let target = this.choices[actor]
            let tag = Roles[this.players[actor].roleid].tag

            let alert = this.players[target].alert
            if(alert){
                this.addTag(alert, actor, 'dead')
                //TODO still dies if being attacked ...
            }

            //If player isn't staying home AND player has a TAG ability
            if(target !== -1 && tag){
                this.addTag(actor, target, tag)
            }
        }
    }

    /*
    this function simply checks for an existing TAG of the SAME name
    if a previous TAG exists, it will begin making a list.
    Otherwise, it will set the first tag.
    */
    addTag(tagger, tagged, tag){
        if(this.players[tagged][tag]){
            this.players[tagged][tag] += s + tagger
        } else {
            this.players[tagged][tag] = tagger
        }
    }

    /*
    regardless of whether or not a role interacts with another role, the role will be performed here
    IF that role DOES interact with another role, the PROC variable should be used to search for a PROC
    PROC tags are NOT being written here, only read / removed
    */
    doRoles(){
        for(i=0;i<this.order.length;i++){
            let actor = this.order[i]
            let target = this.choices[actor]
            let proc = Roles[this.players[actor].roleid].proc

            //Proc unique tags
            if(this.players[target].watch){
                this.events.push(
                    {message: this.players[actor].name + Defaults._seenByWarden, place: this.players[target].watch}
                )
                //TODO double watch is not being handled
            }
            if(this.players[target].alert && this.players[actor].alert != actor){
                this.events.push([
                    {message: Defaults.shotBySoldier, place: actor},
                    {message: Defaults.shotWithSoldier, place: target},
                ])
            }

            //If role has a proc tag ...  
            if(proc){
                // ... search for proc tag on target and run corresponding code
                this.proc(
                    this.players[actor].roleid, //roleId
                    this.players[actor], //roleInfo
                    this.players[target][proc], //proc
                    actor, //place
                    target //choice
                )
            }
        }
    }

    //Mainly used to measure attack / defense
    //A player can be killed by multiple sources, which will all be announced
    activateTag(tagger, tagged, tags){
        let tags = tags.split(s)
        if(tags.length > 1){
            let newTags = tags.slice(1)
            this.players[tagged][tag] = newTags.join(s)
        } else {
            this.players[tagged][tag] = null
        }
    }

    proc(roleId, actorInfo, proc, actor, target){
        switch(roleId){
            case 'a':
                this.events.push(
                    {message: Defaults.gettingRole_ + Role[roleId].name, place: actor}
                )
                break
            case 'b':
            case 'c':
            case 'd':
            case 'e':
                //TODO strong defense proc
                this.events.push(
                    {message: Defaults.stabbedByMafia, place: target},
                    {message: Defaults.stabbedYourTarget, place: actor}
                )
                break
            case 'l':
                this.events.push(
                    {message: Defaults.silenced, place: target}
                )
                break
            case 'A':
                if(proc){
                    this.events.push(
                        {message: Defaults.resultsSus, place: actor} 
                    )
                } else {
                    this.events.push(
                        {message: Defaults.resultsNotSus, place: actor}
                    )
                }
                break
            case 'E':
                if( Roles[ this.players[target].roleid ].type === 2 ){
                    this.events.push(
                        {message: Defaults.resultsNost + Roles[ this.players[target].roleid ].name, place: actor}
                    )
                    this.players[actor].roleid = this.players[target].roleid
                } else {
                    this.events.push(
                        {message: Defaults.resultsNotNost, place: actor}
                    )
                }
                break
            case 'K':
                if(proc){
                    this.events.push(
                        {message: Defaults.healedByDoctor, place: target},
                        {message: Defaults.healedYourTarget, place: actor}
                    )
                    this.activateTag(actor, target, proc)
                }
                break
            case 'R':
                if( !actorInfo.dead ){
                    this.events.push(
                        {message: Defaults.resultsRit, place: actor},
                        {message: Defaults.resultsRevived, place: target}
                    )
                    this.players[actor].dead = true
                    this.players[target].dead = false
                } else {
                    this.events.push(
                        {message: Defaults.resultsNotRit, place: actor}
                    )
                }
                break
            case 'S':
                if( Roles [ this.players [ target ].roleid ].name !== 'Villager' ){
                    this.events.push(
                        {message: Defaults.resultsMayor, place: actor},
                        {message: Defaults.resultsDemoted, place: target}
                    )
                } else {
                    this.events.push(
                        {message: Defaults.resultsMayor, place: actor},
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
            this.players.alert = null //etc
        }
    }

    checkNews(){
        for(var i=0; i<this.players.length; i++){
            //player status living -> dead
            if(!this.players[i].dead && !this.lifeStatus[i]){
                //TODO show how the person died - should be put in roles.js
                this.news.push(
                    this.players[i].name + Defaults._died
                )
            //player status dead -> alive
            } else if (this.players[i].dead && this.lifeStatus[i]){
                this.news.push(
                    this.players[i].name + Defaults._ressed
                )
            } 
        }
    }

    pushToDatabase(){
        firebaseService.fetchRoomRef('').update({
            news: this.news,
            events: [{2:this.events}],
            list: this.players,
            choice: null
        })   
    }

}

export default new actionModule();