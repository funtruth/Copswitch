import { db } from '@services'
import { Announcer, Roles } from '@library'
const { Defaults } = Announcer

const s = ','

class votingModule{

    constructor(){
        this.votes = []
        this.players = []
        this.counter = null
        this.nomination = null
        this.nextCounter = null

        this.innocentVotes = []
        this.guiltyVotes = []

        this.news = []
    }

    reset(){
        this.choices = []
        this.players = []
        this.counter = null
        this.nomination = null
        this.nextCounter = null

        this.innocentVotes = []
        this.guiltyVotes = []

        this.news = []
    }

    runModule(players, votes, counter, nomination) {
        this.reset()

        this.players = players
        this.votes = votes
        this.counter = counter
        this.nomination = nomination

        this.tallyVotes()
        this.recordGuiltyVotes()

        this.pushToDatabase()
    }

    tallyVotes() {
        for (var i=0; i<this.votes.length; i++) {
            if (this.votes[i] === 1) {
                this.innocentVotes.push(this.players[i].name)
            } else if (this.votes[i] === -1) {
                this.guiltyVotes.push(this.players[i].name)
            }
        }
    }

    recordGuiltyVotes() {
        let nameString = ''
        if (this.guiltyVotes.length === 0) {
            nameString = 'Nobody '
        } else if (this.guiltyVotes.length === 1) {
            nameString = (this.guiltyVotes[0] + ' ')
        } else {
            for(var i=0; i<this.guiltyVotes.length; i++){
                nameString += (this.guiltyVotes[i] + ', ')
            }
        }
        
        this.news.push(nameString + 'voted against' + this.players[this.nomination].name + '.')
    }

    findResults() {
        if (this.guiltyVotes.length > this.innocentVotes.length) {
            this.news.push(this.players[this.nomination].name + ' has been hung!')
            this.hangPlayer()
            this.nextCounter = this.counter + 1
        } else {
            this.news.push(this.players[this.nomination].name + ' was not hung.')
            this.nextCounter = this.counter - 1
        }
    }

    hangPlayer() {
        this.players[this.nomination].dead = true
        if (Roles[this.players[this.nomination].roleid].killer) {
            this.assignNewKiller()
        }
        this.pushToDatabase()
    }

    assignNewKiller() {
        let mafiaArr = []
        for (var i=0; i<this.players.length; i++) {
            if (!this.players[i].dead && Roles[this.players[i].roleid].type === 1) {
                mafiaArr.push(i)
            }
        }
        let promoted = null
        if (mafiaArr.length > 0) {
            promoted = mafiaArr[Math.floor(Math.random()*mafiaArr.length)]
        }
        if (promoted !== null) {
            this.players[promoted].roleid = Roles[this.players[this.nomination].roleid].killer
        }
    }

    pushToDatabase(){
        db.fetchRoomRef('').update({
            news: {
                [this.counter]: this.news
            },
            list: this.players,
            counter: this.nextCounter,
            nominate: null,
            choice: null,
            votes: null,
            ready: null
        })   
    }

}

export default new votingModule();