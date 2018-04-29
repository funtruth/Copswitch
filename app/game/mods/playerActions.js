import firebase from '../../firebase/FirebaseController';

class playerAction{

    constructor(){

        this.roomId = null

        this.uid = null
        this.ign = null
        this.owner = false

        this.place = null

        this.roomRef = null

        this.myChoiceRef = null
        this.myReadyRef = null


    }

    initGame(roomId){

        if(!roomId) return

        this.roomId = roomId

        this.roomRef = firebase.database().ref(`rooms/${roomId}`)

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

}

export default new playerAction();