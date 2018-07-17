import { firebaseService } from '@services'

initialState = {}

export function setupAndStartGame(){
    return (dispatch, getState) => {
        const { placeList, roleList, lobbyList } = getState().lobby
    
        let rolesArr = [];
        for(var i in roleList){
            for(var j=0; j<roleList[i]; j++){
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
        
        placeList.forEach(child => {
            const uid = child.val()
            list.push({
                name: lobbyList[uid].name,
                fullName: lobbyList[uid].fullName,
                uid: uid,
                roleid: rolesArr[counter]
            })
            ready.push(false)
            counter++
        })

        let roomRef = firebaseService.fetchRoomRef('')
        roomRef.update({
            list: list,
            ready: ready,
            counter: 0,
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