import firebaseService from "../firebase/firebaseService";

initialState = {

}

export function startGame(){
    return (dispatch, getState) => {
        const { roleList, lobbyList } = getState().lobby
        let roles = [];
    
        let roleListKeys = Object.keys(roleList)
        for(var i=0; i<roleList.length; i++){
            for(var j=0; j<roleList[i]; j++){
                roles.push(roleListKeys[i])
            }
        }
    
        //Fisher-Yates Shuffle
        let counter = roles.length;
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);

            counter--;

            let temp = roles[counter];
            roles[counter] = roles[index];
            roles[index] = temp;
        }

        //Finishing player details
        let list = []
        let ready = []

        let lobbyListKeys = Object.keys(lobbyList)
        for(var i=0; i<lobbyList.length; i++){
            list.push({
                name: lobbyList.name,
                uid: lobbyListKeys[i],
                roleid: roles[i]
            })
            ready.push(false)
        }

        let roomRef = firebaseService.fetchRoomRef('')
        roomRef.set({
            list: list,
            ready: ready,
            counter: 3,
            status: 'Starting'//TODO pick a word lmao
        })
        
    }
}

export default (state = initialState, action) => {

    switch(action.type){
        default:
            return state;
    }

}