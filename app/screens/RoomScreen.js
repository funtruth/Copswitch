
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    Text,
    StyleSheet,
    TextInput,
    Keyboard,
    FlatList,
    ListView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Modal
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import randomize from 'randomatic';

import { MenuButton } from '../components/MenuButton.js';

import { isInGame } from "../auth";
import { isInRoom } from "../auth";
import colors from '../misc/colors.js';
import Rolesheet from '../misc/roles.json';

import Mafia_Screen from './MafiaScreen.js';
import { Creation } from '../../router';

//Firebase
import firebase from '../firebase/FirebaseController.js';

export default class Room_Screen extends React.Component {

    constructor(props) {
        super(props);
    }

    _createRoom() {
        const roomname = randomize('A',4);

        //TODO: Check if room already exists
        
        AsyncStorage.setItem('ROOM-KEY', roomname);
        
        firebase.database().ref('rooms/' + roomname).set({
            phase: 1,
            owner: firebase.auth().currentUser.uid,
            daycounter:1,
        });
        
        firebase.database().ref('listofroles/'+firebase.auth().currentUser.uid).update({b:0})

        this.props.navigation.dispatch(
            NavigationActions.navigate({
                routeName: 'CreationTutorial',
                action: NavigationActions.navigate({ 
                    routeName: 'Creation1',
                    params: {roomname:roomname}
                })
            })
        )
    }

    _joinRoom() {
        this.props.navigation.dispatch(
            NavigationActions.navigate({
                routeName: 'JoinTutorial',
                action: NavigationActions.navigate({ 
                    routeName: 'Join1'
                })
            })
        )
    }

    render() {
        return <View style = {{ flex:1, backgroundColor:colors.background }}>

            <View style = {{flex:0.74}}/>
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Make Room'
                onPress = {()=>{ 
                    this._createRoom();
                 }}
            />
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                fontSize = {25}
                title = 'Join Room'
                onPress = {()=>{ 
                    this._joinRoom();
                 }}
            />
            <View style = {{flex:0.02}}/>
        </View>
    }
}

class Join_Screen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            roomname: '',
            alias:'',
        };
    }

    _valid(name,roomname) {
        if(name.length > 0 && name.length < 11){
            if(roomname.length == 4){
                firebase.database().ref('rooms/' + roomname + '/listofplayers')
                .orderByChild('name').equalTo(name).once('value',snap=>{
                    if(snap.exists()){
                        alert('Name is already taken.')
                    } else {
                        firebase.database().ref('rooms/' + roomname).once('value', snap => {
                            if(snap.exists() && (snap.val().phase == 1)){
                                this._joinRoom(roomname)
                            } else if (snap.exists() && (snap.val().phase > 1)) {
                                alert('Game has already started.')
                            } else {
                                alert('Room does not Exist.')
                            }
                        })
                    }
                })
            } else {
                alert('Room name must be 4 characters in length.')
            }
        } else {
            alert('Name is not a valid length (10 characters or less).')
        }
    }

    _joinRoom(roomname) {
        AsyncStorage.setItem('ROOM-KEY', roomname);

        firebase.database().ref('rooms/' + roomname 
            + '/listofplayers/' + firebase.auth().currentUser.uid).update({
                name:               this.state.alias,
                actionbtnvalue:     false,
                presseduid:         'foo',
        });   

        firebase.database().ref('rooms/' + roomname + '/playernum').transaction((playernum) => {
            return playernum + 1;
        });       
        
        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Lobby_Screen', params:{roomname:roomname}})
                ]
            })
        )
    }

    render() {
        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:colors.background}}>
                <View style = {{flex:0.5,backgroundColor:colors.background,
                    justifyContent:'center', alignItems:'center'}}>

                    <View style ={{flex:0.4}}/>

                    <TouchableOpacity
                        style = {{flexDirection:'row'}}
                        onPress = {()=>{
                            this.props.navigation.goBack();
                        }}
                    >
                        <MaterialCommunityIcons name='home'
                            style={{color:colors.main,fontSize:40,alignSelf:'center'}}/>
                    </TouchableOpacity>

                    <View style = {{ justifyContent: 'center', flexDirection: 'row' }}>
                        <TextInput
                            placeholder="Who are you?"
                            placeholderTextColor={colors.main}
                            style={{
                                backgroundColor: colors.background,
                                flex:0.6,
                                fontFamily:'ConcertOne-Regular',
                                fontSize: 20,
                                color:colors.font,
                                textAlign:'center',
                            }}
                            value={this.state.alias}
                            autoFocus = {true}
                            blurOnSubmit={false}
                            onChangeText = {(text) => {this.setState({alias: text})}}
                            onSubmitEditing = {()=>this.refs['roomcode'].focus()}
                        />
                    </View>
                    <View style = {{ justifyContent: 'center', flexDirection: 'row' }}>
                        <TextInput
                            ref='roomcode'
                            placeholder="Room Code"
                            placeholderTextColor={colors.main}
                            style={{
                                backgroundColor: colors.background,
                                flex:0.6,
                                fontFamily:'ConcertOne-Regular',
                                fontSize: 20,
                                color:colors.font,
                                textAlign:'center',
                            }}
                            value={this.state.roomname}
                            autoCapitalize='characters'
                            blurOnSubmit={false}
                            onChangeText = {(text) => {this.setState({roomname: text})}}
                            onSubmitEditing = {()=>{Keyboard.dismiss()}}
                        />
                    </View>

                    <MenuButton 
                        title="Join Room"
                        flex = {0.75}
                        fontSize={20}
                        onPress={()=>{
                            this._valid(this.state.alias,this.state.roomname.toUpperCase())
                        }}
                    />

                </View>
            </View>
        </TouchableWithoutFeedback>
    }
}

class Lobby_Screen extends React.Component {

    _leaveRoom() {

        AsyncStorage.removeItem('ROOM-KEY');

        firebase.database().ref('rooms/'+this.state.roomname+'/playernum').transaction((playernum) => {
            return (playernum - 1);
        });
        this.listRef.child(firebase.auth().currentUser.uid).remove();
        
        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                actions: [
                NavigationActions.navigate({ routeName: 'Room_Screen'})
                ]
            })
        )
    }

    _recommendedBtnPress(mode,playercount){
        this.roleCount.remove();

        firebase.database().ref('recommended/' + playercount + '/' + mode).once('value',snap=>{
            snap.forEach((child)=>{
                this.roleCount.child(child.key).update(child.val())
            })
        })
    }
}

export class Expired_Screen extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    _continueGame() {
        AsyncStorage.getItem('GAME-KEY',(error,result)=>{
            this.props.navigation.dispatch(
                NavigationActions.navigate({
                    routeName: 'Mafia',
                    action: NavigationActions.navigate({ 
                        routeName: 'MafiaRoom',
                        params: {roomname:result}
                    })
                })
            )
        })
    }

    _resetGame(){
        AsyncStorage.removeItem('ROOM-KEY');
        AsyncStorage.removeItem('GAME-KEY');
    
        firebase.database().ref('messages/' + firebase.auth().currentUser.uid).remove();
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/room')
            .update({ name: null });

        this.props.navigation.dispatch(
            NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: 'SignedIn'})
                ]
            })
        )
    }
    
    _renderHeader() {
        return <Text style = {{fontFamily:'ConcertOne-Regular',fontSize:25,color:colors.font}}>
        Your game expired</Text>
    }
    
    _renderImage() {
        return <Text style = {{fontFamily:'ConcertOne-Regular',fontSize:25,color:colors.font}}>
        You are in a Game</Text>
    }
    
    render() {
        return <View style = {{flex:3,backgroundColor:colors.background,justifyContent:'center'}}>
            <View style = {{flex:0.8,justifyContent:'center'}}>
                <View style = {{flex:0.7,justifyContent:'center',alignItems:'center'}}>
                    
                </View>
            </View>
            <View style = {{flex:0.1,justifyContent:'center',flexDirection:'row'}}>
                <TouchableOpacity
                    onPress={()=>{this._continueGame()}}
                    style={{
                        flex:0.7,
                        justifyContent:'center',
                        backgroundColor:colors.main,
                        borderRadius:15,
                    }}
                ><Text style = {{alignSelf:'center',color:colors.background,
                    fontFamily:'ConcertOne-Regular',fontSize:25}}>CONTINUE?</Text>
                </TouchableOpacity>
            </View>
            <View style = {{flex:0.07,justifyContent:'center',flexDirection:'row'}}>
                <TouchableOpacity
                    onPress={()=>{this._resetGame()}}
                    style={{
                        flex:0.2,
                        justifyContent:'center',
                    }}
                ><Text style = {{alignSelf:'center',color:colors.main,
                    fontFamily:'ConcertOne-Regular',fontSize:20}}>QUIT</Text>
                </TouchableOpacity>
            </View>
            <View style = {{flex:0.03}}/>
        </View>
        }
}

const styles = StyleSheet.create({
    actionButtonItem: {
        fontSize: 20,
        height: 22,
        color: colors.font,
    },
    concerto: {
        fontSize:17,
        fontFamily:'ConcertOne-Regular',
        color:colors.font,
        alignSelf: 'center',
    },
    headerStyle: {
        fontSize:20,
        fontFamily: 'ConcertOne-Regular',
        color:colors.font,
    },

});