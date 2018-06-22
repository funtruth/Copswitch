import firebaseService from "../firebase/firebaseService";

initialState = {

}

export function setupAndStartGame(){
    return (dispatch, getState) => {
        const { roleList, lobbyList } = getState().lobby
        const roles = roleList.val()
        const lobby = lobbyList.val()
        let rolesArr = [];
    
        let roleListKeys = Object.keys(roleList)
        for(var i in roles){
            for(var j=0; j<roles[i]; j++){
                rolesArr.push(i)
            }
        }
    
        //Fisher-Yates Shuffle
        let counter = rolesArr.length;
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);

            counter--;

            let temp = rolesArr[counter];
            rolesArr[counter] = rolesArr[index];
            rolesArr[index] = temp;
        }

        //Finishing player details
        let list = []
        let ready = []

        counter = 0
        for(var i in lobby){
            list.push({
                name: lobby[i].name,
                uid: i,
                roleid: rolesArr[counter]
            })
            ready.push(false)
            counter++
        }

        let roomRef = firebaseService.fetchRoomRef('')
        roomRef.update({
            list: list,
            ready: ready,
            counter: 3,
            status: 'Running'
        })
        
    }
}

export default (state = initialState, action) => {

    switch(action.type){
        default:
            return state;
    }

}