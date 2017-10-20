
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    BackHandler,
    Text,
    Keyboard,
    TouchableOpacity
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Firebase
import firebase from '../firebase/FirebaseController.js';

export default class Options_Screen extends React.Component {

constructor(props) {
    super(props);
    
    const { params } = this.props.navigation.state;
    const roomname = params.roomname;

    this.state = {
        roomname:           params.roomname,
        gameover:           false,
        townwin:            false,

        checked:            false,
        roomexists:         false,
    };

    this.roomRef = firebase.database().ref('rooms/' + roomname);

}

componentWillMount() {

    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);

    this.roomRef.on('value',snap=>{
        if(snap.exists()){
            this.roomRef.child('mafia').once('value',mafia=>{
                if(mafia.numChildren() == 0){
                    this.setState({
                        checked:    true,
                        gameover:   true,
                        townwin:    true,
                        roomexists: true,
                    })
                } else if(mafia.numChildren()*2+1 > snap.val().playernum){
                    this.setState({
                        checked:    true,
                        gameover:   true,
                        townwin:    false,
                        roomexists: true,
                    })
                } else {
                    this.setState({
                        checked:    true,
                        gameover:   false,
                        roomexists: true,
                    })
                }
            })
        } else {
            this.setState({
                checked:            true,
                gameover:           false,
                roomexists:         false,
            })
        }
    })

}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);

    if(this.roomRef){
        this.roomRef.off();
    }

}

_handleBackButton() {
    return true;
}

_resetGame(){
    AsyncStorage.removeItem('ROOM-KEY');
    AsyncStorage.removeItem('GAME-KEY');

    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
        .update({ name: null, phase:1 })
    this.props.navigation.navigate('Room_Screen')
}

_renderHeader() {
    return this.state.gameover?
        (this.state.townwin?<Text>town wins</Text>:<Text>mafia wins</Text>)
        :
        <Text>Looks like you were in a Game</Text>
}

_renderImage() {
    return this.state.gameover?
    (this.state.townwin?<Text>town wins image</Text>:<Text>mafia wins image</Text>)
    :
    <Text>Looks like you were in a Game IMAGE</Text>
}

render() {

    if(!this.state.checked){
        return null
    }

    return <View style = {{flex:1,backgroundColor:'white'}}>
        <View style = {{flex:1,justifyContent:'center'}}>
            <View style = {{flex:0.7,justifyContent:'center',alignItems:'center'}}>
                {this._renderHeader()}
            </View>
        </View>
        <View style = {{flex:2,justifyContent:'center'}}>
            <View style = {{flex:0.7,justifyContent:'center',alignItems:'center'}}>
                {this._renderImage()}
            </View>
        </View>
        <View style = {{flex:1,justifyContent:'center'}}>
            <TouchableOpacity
                onPress={()=>{this.props.navigation.navigate('Mafia_Screen',{roomname:this.state.roomname})}}
                style={{
                    flex:0.7,
                    justifyContent:'center',
                    backgroundColor:'black',
                    opacity:this.state.roomexists?1:0.5
                }}
                disabled={!this.state.roomexists}
            ><Text style = {{alignSelf:'center',color:'white'}}>CONTINUE</Text>
            </TouchableOpacity>
        </View>
        <View style = {{flex:1,justifyContent:'center'}}>
            <TouchableOpacity
                onPress={()=>{this._resetGame()}}
                style={{flex:0.7,justifyContent:'center',backgroundColor:'black'}}
            ><Text style = {{alignSelf:'center',color:'white'}}>QUIT</Text>
            </TouchableOpacity>
        </View>
    </View>
    }
}
