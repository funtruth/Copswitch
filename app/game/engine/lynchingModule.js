import firebaseService from '../../firebase/firebaseService';

import Roles from '../../misc/roles.js';
import { Defaults } from '../../commands/announcerPack';

const s = ','

class lynchingModule{

    constructor(){
        this.choices = []
        this.players = []
        this.counter = null
        this.nextCounter = null

        this.ballots = []
        this.ballotCount = 0
        this.triggerNum = null
        this.playerNum = null

        this.nominate = null
        this.news = []
    }

    reset(){
        this.choices = []
        this.players = []
        this.counter = null
        this.nextCounter = null

        this.ballots = []
        this.ballotCount = 0
        this.triggerNum = null
        this.playerNum = null

        this.nominate = null
        this.news = []
    }

    runModule(players, choices, counter, triggerNum, playerNum) {
        this.reset()

        this.players = players
        this.choices = choices
        this.counter = counter

        this.triggerNum = triggerNum
        this.playerNum = playerNum

        this.tallyBallots()
        this.recordGuiltyVotes()

        this.pushToDatabase()
    }

    tallyBallots() {
        for (var i=0; i<this.choices.length; i++){
            if (this.choices[i] !== null){
                this.ballots[this.choices[i]]++
                this.ballotCount++
            }
        }
    }

    checkBallots() {
        let flag = false
        for (var i=0; i<this.ballots.length; i++){
            if (ballots[i] >= this.triggerNum) {
                flag = true
                this.nominate = i
                this.news.push(this.players[i].name + ' has been put on trial.')
                this.nextCounter = this.counter + 1
                break
            }
        }

        if (flag) {
            this.pushToDatabase()
        } else if (this.ballotCount >= this.playerNum) {
            this.nextCounter = this.counter + 2
            this.pushToDatabase()
        }
    }

    pushToDatabase(){
        firebaseService.fetchRoomRef('').update({
            news: {
                [this.counter]: this.news
            },
            counter: this.nextCounter,
            nominate: this.nominate,
            choice: null,
            ready: null
        })   
    }

}

export default new lynchingModule();