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

import colors from '../misc/colors.js';

import Modal from '../components/Modal';
import Nomination from './components/Nomination.js';
import { Button } from '../components/Button.js';
import Console from './components/Console.js';
import { Rolecard } from '../components/Rolecard.js';
import General from './components/General.js';
import Private from './components/Private.js';
import PlayerList from './components/PlayerList';
import RuleBook from '../menu/ListNavigator';
import InfoPage from '../menu/InfoPageScreen';
import Roles from '../menu/RoleScreen';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import firebaseService from '../firebase/firebaseService';
import playerModule from './mods/playerModule';
import ownerModule from './mods/ownerModule';

class GameScreen extends Component {

constructor(props) {
    super(props);

    this.state = {
        message:            '',

        section:            null,
        viewPlayerList:     false,

        ready:              false,
    };
    
    this.readylist          = [];

    this.width              = Dimensions.get('window').width;
    this.icon               = this.width*0.12;

    this.user               = null

    this.readyRef           = null
    this.ownerRef           = null

}

componentWillMount() {

    this.user               = firebaseService.getUid()

    this.readyRef           = firebaseService.fetchRoomRef('ready');
    this.ownerRef           = firebaseService.fetchRoomInfoRef('owner')

    //Move this to proper component
    this.readyRef.on('value',snap=>{

        if(snap.exists()){
            this.readylist = snap.val()
        }

    })

    this.ownerRef.on('value',snap=>{

        if(snap.exists()){
            ownerModule.ownerMode( snap.val() === this.user )
        }

    })

}

componentWillUnmount() {

    if(this.readyRef) this.readyRef.off()
    if(this.ownerRef) this.ownerRef.off()

}

_game(){
    this.setState({section:this.state.ready})
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
        width:this.width*0.37, height:this.width*0.37}}>

        <Button
            horizontal = {1}
            containerStyle = {{width:this.icon, position:'absolute', top:0, left:this.width*0.2}}
            style = {{borderRadius:this.icon/2}}
            touchStyle = {{height:this.icon, borderRadius:this.icon/2}}
            onPress={()=>this.setState({ section:'news'})}
        ><FontAwesome name='globe'
            style={{color:colors.shadow,fontSize:20,textAlign:'center'}}/>
        </Button>

        <Button
            horizontal = {1}
            containerStyle = {{width:this.icon, position:'absolute', left:25, top:25}}
            style = {{borderRadius:this.icon/2}}
            touchStyle = {{height:this.icon, borderRadius:this.icon/2}}
            onPress={()=>this.setState({ section:'role'})}
        ><FontAwesome name='user'
            style={{color:colors.shadow,fontSize:20,textAlign:'center'}}/>
        </Button>

        <Button
            horizontal = {1}
            containerStyle = {{width:this.icon, position:'absolute', left:0, top:this.width*0.2}}
            style = {{borderRadius:this.icon/2}}
            touchStyle = {{height:this.icon, borderRadius:this.icon/2}}
            onPress={()=>this.setState({ section:'menu'})}
        ><FontAwesome name='book'
            style={{color:colors.shadow,fontSize:20,textAlign:'center'}}/>
        </Button>

        <Button
            horizontal = {1}
            containerStyle = {{width:this.icon+10, position:'absolute', right:15, bottom:13}}
            style = {{borderRadius:this.icon/2+5}}
            touchStyle = {{height:this.icon+10, borderRadius:this.icon/2+5}}
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

            <Private {...this.props.screenProps}/>

            <Modal 
                visible = {this.state.viewPlayerList}
                closeModal = {()=>this.setState({viewPlayerList:false})}
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

export default GameScreen