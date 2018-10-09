import firebase from '../app/admin'

class FirebaseService{
    constructor(){
        this.uid = null
        this.roomId = null
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

    joinRoom(roomId, fullName){
        if(!roomId) return
        this.roomId = roomId
        
        firebase.database().ref(`rooms/${roomId}/lobby/${this.uid}`).update({
            uid: this.uid,
            fullName: fullName,
        })
    }

    ref(path) {
        return firebase.database().ref(path)
    }

    fetchRoomRef(path){
        return firebase.database().ref(`rooms/${this.roomId}/${path}`)
    }

    leaveLobby(){
        //If already left lobby, don't do anything
        if(!this.roomId) return
        firebase.database().ref(`rooms/${roomId}/lobby/${this.uid}`).remove()
    }

    deleteRoom(){
        firebase.database().ref(`rooms/${this.roomId}`).remove()
    }

    updateUsername(newName){
        firebase.database().ref(`rooms/${this.roomId}/lobby/${this.uid}`).update({
            name:newName,
        })
    }

    changeRoleCount(key,change){
        firebase.database().ref(`rooms/${this.roomId}`)
            .child('roles').child(key).transaction(count=>{
                return change?count+1:count-1
            })
    }
}

export default new FirebaseService();