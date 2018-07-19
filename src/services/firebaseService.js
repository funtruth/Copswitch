import firebase from '../app/admin'

class FirebaseService{
    constructor(){
        this.uid = null
        this.pushKey = null //push key upon entering room

        this.roomId = null
        this.roomRef = null
        this.myInfoRef = null
    }

    //General
    get(path){
        return firebase.database().ref(path).once('value').then(snap => {
            return snap.val();
        });
    }
    getSnap(path){
        return firebase.database().ref(path).once('value').then(snap => {
            return snap;
        });
    }

    //Fetch
    getUid(){
        return this.uid
    }
    getRoomId(){
        return this.roomId
    }

    //TODO test how well this works 
    initUser(){
        firebase.auth().onAuthStateChanged( user =>{
            if(user){
                this.uid = user.uid
            } else {
                firebase.auth().signInAnonymously()
                    .then(user => alert(user.uid))
            }
        })
    }

    initRefs(roomId) {
        if(!roomId) return
        
        this.roomId = roomId
        this.roomRef = firebase.database().ref(`rooms/${roomId}`)

        this.myInfoRef = firebase.database().ref(`rooms/${roomId}/lobby/${this.uid}`)
    }

    wipeRefs(){
        this.pushKey = null

        this.roomId = null
        this.roomRef = null

        this.myInfoRef = null
    }

    joinRoom(roomId, fullName){
        let pushKeyRef = firebase.database().ref(`rooms/${roomId}/place`)
        this.pushKey = pushKeyRef.push().key

        let batch = {}

        batch[`place/${this.pushKey}`] = this.uid
        batch[`lobby/${this.uid}`] = { fullName: fullName, uid: this.uid }
        
        firebase.database().ref(`rooms/${roomId}`).update(batch)
    }

    removePushKey(){
        if(!this.pushKey) return
        let placeRef = firebase.database().ref(`rooms/${this.roomId}/place`)
        placeRef.child(this.pushKey).remove()
    }

    fetchRoomRef(path){
        return firebase.database().ref(`rooms/${this.roomId}/${path}`)
    }

    leaveLobby(){
        //If already left lobby, don't do anything
        if(!this.roomRef) return
    
        this.myInfoRef.remove()
        this.removePushKey()

        this.wipeRefs()
    }

    deleteRoom(){
        this.roomRef.remove()
    }

    update(path, obj) {
        firebase.database().ref(path).update(obj)
    }

    updateUsername(newName){
        firebase.database().ref(`rooms/${this.roomId}/lobby/${this.uid}`).update({
            name:newName,
        })
    }

    changeRoleCount(key,change){
        this.roomRef.child('roles').child(key).transaction(count=>{
            return change?count+1:count-1
        })
    }
}

export default new FirebaseService();