import React, { Component } from 'react';
import {
    View,
    Image,
    AsyncStorage,
    Text,
    FlatList,
    Animated,
    Dimensions,
    TouchableOpacity
}   from 'react-native';
import { connect } from 'react-redux'
import { pushNewListener, newRoomInfo } from '../room/RoomReducer'

import colors from '../misc/colors.js';

import Modal from '../components/Modal';
import { Button } from '../components/Button.js';
import { Rolecard } from '../components/Rolecard.js';
import { Console, General, Nomination, PlayerList, Private } from './components'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import firebaseService from '../firebase/firebaseService';
import playerModule from './mods/playerModule';
import ownerModule from './mods/ownerModule';

const { height, width } = Dimensions.get('window')
const icon = 0.12 * width

class GameScreen extends Component {

constructor(props) {
    super(props);

    this.state = {
        section:            null,
        viewPlayerList:     false,
    };

    this.listening = false
}

componentWillMount() {
    if(!this.listening) this.turnOnGameListeners()
}

turnOnRoomListeners(){
    this.listening = true
    this.RoomListenerOn('nomination','nomination','value')
    this.RoomListenerOn('counter','counter','value')
    this.RoomListenerOn('myReady',`ready/${this.props.place}`,'value')
    this.RoomListenerOn('list','list','value')
    this.RoomListenerOn('news','news','child_added')
}

RoomListenerOn(listener,listenerPath,listenerType){
    let listenerRef = firebaseService.fetchRoomRef(listenerPath)
    this.props.pushNewListener(listenerRef)
    listenerRef.on(listenerType, snap => {
        this.props.newRoomInfo(snap, listener)
    })
}

_game(){
    this.setState({section:this.props.ready})
}

//TODO Handling Game Ending
_gameOver() {
    AsyncStorage.removeItem('ROOM-KEY');
    AsyncStorage.removeItem('GAME-KEY');

    playerModule.wipeGame()
    ownerModule.gameOver()
    
    this.props.screenProps.navigate('Home')
}


_renderWaiting(){
    return <View>

        <View style = {{
            borderRadius:15,
            backgroundColor:colors.progressd, justifyContent:'center', alignItems:'center'
        }}> 
            <Text style = {styles.plainfont}>{'/' + this.state.playernum}</Text>
        </View>

        <Button
            horizontal = {0.3}
            onPress = {()=> this._resetOptionPress()}
        ><Text style = {styles.cancelButton}>Cancel</Text>
        </Button>
        
    </View>
}

_renderNav(){
    return <Animated.View style = {{position:'absolute', bottom:0, right:0, 
        width:width*0.37, height:width*0.37}}>

        <Button
            horizontal = {1}
            containerStyle = {{width:icon, position:'absolute', top:0, left:width*0.2}}
            style = {{borderRadius:icon/2}}
            touchStyle = {{height:icon, borderRadius:icon/2}}
            onPress={()=>this.setState({ section:'news'})}
        ><FontAwesome name='globe'
            style={{color:colors.shadow,fontSize:20,textAlign:'center'}}/>
        </Button>

        <Button
            horizontal = {1}
            containerStyle = {{width:icon, position:'absolute', left:25, top:25}}
            style = {{borderRadius:icon/2}}
            touchStyle = {{height:icon, borderRadius:icon/2}}
            onPress={()=>this.setState({ section:'role'})}
        ><FontAwesome name='user'
            style={{color:colors.shadow,fontSize:20,textAlign:'center'}}/>
        </Button>

        <Button
            horizontal = {1}
            containerStyle = {{width:icon, position:'absolute', left:0, top:width*0.2}}
            style = {{borderRadius:icon/2}}
            touchStyle = {{height:icon, borderRadius:icon/2}}
            onPress={()=>this.setState({ section:'menu'})}
        ><FontAwesome name='book'
            style={{color:colors.shadow,fontSize:20,textAlign:'center'}}/>
        </Button>

        <Button
            horizontal = {1}
            containerStyle = {{width:icon+10, position:'absolute', right:15, bottom:13}}
            style = {{borderRadius:icon/2+5}}
            touchStyle = {{height:icon+10, borderRadius:icon/2+5}}
            onPress={()=>this._game()}
        ><FontAwesome name='home'
            style={{color:colors.shadow,fontSize:30,textAlign:'center'}}/>
        </Button>

    </Animated.View>
}

    render() {

        return <View style = {{flex:1}}>

            <General />

            <Console 
                viewList = {()=>this.setState({viewPlayerList:true})}
            />

            <Private />

            <Modal 
                visible = {this.state.viewPlayerList}
                onClose = {()=>this.setState({viewPlayerList:false})}
            >
                <PlayerList />
            </Modal>

            <Nomination />

        </View>
    }
}

const styles = {
    player: {
        fontSize: 16,
        fontFamily: 'FredokaOne-Regular',
        color: colors.shadow,
        margin:5,
    },
    plainfont: {
        color: colors.font,
        margin:5,
        fontFamily: 'FredokaOne-Regular',
    },
    cancelButton: {
        fontSize: 16,
        fontFamily: 'FredokaOne-Regular',
        color: colors.shadow,
        margin:5,
    }
}

export default connect(
    state => ({
        ready: state.room.myReady
    }),
    dispatch => {
        return {
            pushNewListener: (listenerRef) => dispatch(pushNewListener(listenerRef)),
            newRoomInfo: (snap, listener) => dispatch(newRoomInfo(snap,listener))
        }
    }
)(GameScreen)