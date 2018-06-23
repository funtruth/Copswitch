import firebaseService from '../../firebase/firebaseService'
import actionModule from './actionModule'

const initialState = {
    ownership: false,
    activeListeners: [],
}

const OWNERSHIP_LISTENER = 'owner/ownership_listener'
const PUSH_NEW_LISTENER = 'owner/push_new_listener'
const CLEAR_LISTENERS = 'owner/clear_listeners'

export function ownershipMode(ownership) {
    return (dispatch) => {
        dispatch({
            type: OWNERSHIP_LISTENER,
            payload: ownership
        })
        console.log('ownership', ownership)
        if (ownership) {
            dispatch(turnOnListeners())
        } else {
            dispatch(turnOffListeners())
        }
    }
}

function turnOnListeners() {
    return (dispatch) => {
        dispatch(ownerListenerOn('loaded','loaded','value'))
        dispatch(ownerListenerOn('choice','choice','value'))
        dispatch(ownerListenerOn('votes','votes','value'))
    }
}

function ownerListenerOn(listener, listenerPath, listenerType) {
    return (dispatch, getState) => {
        let listenerRef = firebaseService.fetchRoomRef(listenerPath)
        dispatch({
            type: PUSH_NEW_LISTENER,
            payload: listenerRef
        })
        listenerRef.on(listenerType, snap => {
            dispatch(handleNewInfo(snap, listener))
        })
    }
}

function handleNewInfo(snap, listener) {
    return (dispatch, getState) => {
        if (!snap.exists()) return

        let roomRef = firebaseService.fetchRoomRef('')

        const { counter, phase, playerNum, triggerNum, playerList } = getState().game
        if (!counter) return
        switch(listener){
            case 'loaded':
                if (snap.numChildren() < playerNum) return

                roomRef.update({counter: counter+1})
                .then(()=>{
                    var ready = []
                    for(i=0; i<playerList.length; i++){
                        ready[i] = false
                    }

                    roomRef.update({
                        ready,
                        loaded: null,
                        choice: null
                    })
                })
                break
            case 'choice':
                let total = 0;

                for(i=0;i<snap.val().length;i++){
                    if(snap.val()[i]) total++
                }

                if (phase == 0 && total>=triggerNum){
                    let flag = false;

                    for(var i=0; i<triggerNum; i++){
                        let count = 0;
                        let players = 0;

                        if(snap.val()[i] && snap.val()[i]!=-1){

                            for(j=0; j<playerNum; j++){
                                if(snap.val()[i] == snap.val()[j]){
                                    count++
                                }
                            }

                            if(count >= triggerNum){
                                flag = true
                                roomRef.update({nominate:snap.val()[i]}).then(()=> {}
                                    //this._globalMsg(playerList[snap.val()[i]].name + ' has been nominated.')
                                )
                            }
                            players++;
                        }

                        if(flag) break
                    }

                    if(flag){
                        //ref.remove();

                    } else if(!flag && players >= playerNum){
                        //ref.remove();
                        //this._resetDayStatuses();
                        dispatch(changePhase())
                    }
                    
                } else if (phase == 1 && total >= playerNum){
                    actionModule.clear()
                    actionModule.runActionModule(playerList, snap.val())

                    //TODO wait for a promise or somehitng
                    dispatch(changePhase())
                }
                break
            case 'votes':
                let totalVotes = 0;

                for(i=0;i<snap.val().length;i++){
                    if(snap.val()[i]) totalVotes++
                }

                if(totalVotes >= playerNum - 1){

                    var count = 0
                    var names = []
                    var nameString = ''

                    for(var i=0; i<playerNum; i++){
                        if(snap.val()[i] == -1){
                            names.push(playerList[i].name)
                            count++
                        } else {
                            count--
                        }
                    }

                    for(var i=0; i<names.length; i++){
                        nameString += names[i]
                    }

                    //this._globalMsg((nameString || 'Nobody') + ' voted against ' + playerList[this.nominate].name + '.')

                    if(count>0){
                        firebaseService.fetchRoomRef('list').child(this.nominate).update({dead:true})

                        this._globalMsg(this.playerList[this.nominate].name + ' was hung.')

                        if(this.playerList[this.nominate].roleid == 'a' || this.playerList[this.nominate].roleid == 'b'){
                            //TODO NEW MURDERER LOGIC
                        } 
                    } else {
                        //this._globalMsg(this.playerList[this.nominate].name + ' was not hung.')
                        firebaseService.fetchRoomRef('nominate').remove()
                    }
                }
                break
            default:
        }
    }
}

/*
function changePhase removes the 'ready' ref, which does not directly change phase.
instead, all players are brought to the loading screen,
where they will write to the 'loaded' ref to indicate they are active.
The owner listens to 'loaded' ref, and will actually change the phase once everyone is done.
*/
function changePhase() {
    return (dispatch) => {
        let readyRef = firebaseService.fetchRoomRef('ready')
        readyRef.remove()
    }
}

function turnOffListeners() {
    return (dispatch, getState) => {
        const { activeListeners } = getState().owner
        for(var i=0; i<activeListeners.length; i++){
            activeListeners[i].off()
        }
        dispatch({
            type: CLEAR_LISTENERS
        })
    }
}

export default (state = initialState, action) => {

    switch(action.type){
        case OWNERSHIP_LISTENER:
            return { ...state, ownership: action.payload }
        case PUSH_NEW_LISTENER:
            return { ...state, activeListeners: [...state.activeListeners, action.payload] }
        case CLEAR_LISTENERS:
            return { ...state, activeListeners: [] }
        default:
            return state;
    }

}