
import React from 'react';
import { Button } from 'react-native-elements';
import {
    View,
    Image,
    AsyncStorage,
    Text,
    StyleSheet,
    TextInput,
    Keyboard,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Animated,
    Modal
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import randomize from 'randomatic';
import * as Animatable from 'react-native-animatable';
const QUICK_ANIM    = 400;
const MED_ANIM      = 600;
const SLOW_ANIM     = 1000;

import { MenuButton } from '../components/MenuButton.js';

import colors from '../misc/colors.js';
import Rolesheet from '../misc/roles.json';

//Firebase
import firebase from '../firebase/FirebaseController.js';

export default class Room_Screen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            connected: true,
            loading: false,

            pressFlex:      new Animated.Value(0.69),
            textOpacity:    new Animated.Value(0),
            btnOpacity:    new Animated.Value(0),
        }

        this.connectedRef = firebase.database().ref(".info/connected");
    }

    componentWillMount() {
        this.connectedRef.on('value',snap=>{
            if(snap.val()==true){
                this.setState({connected:true})
            } else {
                this.setState({connected:false})
            }
        })


    }

    componentWillUnmount() {
        if(this.connectedRef){
            this.connectedRef.off();
        }
    }

    componentDidMount() {
        Animated.sequence(
            Animated.timing(
                this.state.pressFlex, {
                    duration: SLOW_ANIM,
                    toValue: 0.69
            }).start(),
            Animated.timing(
                this.state.btnOpacity, {
                    duration: SLOW_ANIM,
                    toValue: 1
            }).start(),
            Animated.timing(
                this.state.textOpacity, {
                    duration: SLOW_ANIM,
                    toValue: 1
            }).start(),
        )
    }

    _createRoom() {
        if(this.state.connected){
            this._handlePress()

            setTimeout(() => {
                
                const roomname = randomize('0',6);
                //TODO: Check if room already exists
                AsyncStorage.setItem('ROOM-KEY', roomname);
                firebase.database().ref('rooms/' + roomname).set({
                    phase: 1,
                    owner: firebase.auth().currentUser.uid,
                    daycounter:1,
                }).then(()=>{
                    firebase.database().ref('listofroles/'+firebase.auth().currentUser.uid)
                    .update({b:0}).then(()=>{
                        this.props.navigation.dispatch(
                            NavigationActions.navigate({
                                routeName: 'CreationTutorial',
                                action: NavigationActions.navigate({ 
                                    routeName: 'Creation1',
                                    params: {roomname:roomname}
                                })
                            })
                        )
    
                        this._returnView()
                    })
                })

            }, MED_ANIM);

            
        } else {
            this.refs.wifi.shake(800)
        }
            
    }

    _handlePress() {
        Animated.sequence(
            Animated.timing(
                this.state.pressFlex, {
                    duration: MED_ANIM,
                    toValue: 0.4
            }).start(),
            Animated.timing(
                this.state.btnOpacity, {
                    duration: QUICK_ANIM,
                    toValue: 0
            }).start(),
            Animated.timing(
                this.state.textOpacity, {
                    duration: QUICK_ANIM,
                    toValue: 0
            }).start(),
        )
    }
    _returnView() {
        Animated.sequence(
            Animated.timing(
                this.state.pressFlex, {
                    duration: SLOW_ANIM,
                    toValue: 0.69
            }).start(),
            Animated.timing(
                this.state.btnOpacity, {
                    duration: SLOW_ANIM,
                    toValue: 1
            }).start(),
            Animated.timing(
                this.state.textOpacity, {
                    duration: SLOW_ANIM,
                    toValue: 1
            }).start(),
        )
    }

    _joinRoom() {
        if(this.state.connected){
            this._handlePress()

            setTimeout(() => {
                this.props.navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: 'JoinTutorial',
                        action: NavigationActions.navigate({ 
                            routeName: 'Join1'
                        })
                    })
                );
                this._returnView()
            }, MED_ANIM)
            
        } else {
            this.refs.wifi.shake(800)
        }
    }

    render() {
        return <View style = {{ flex:1, backgroundColor:colors.background }}>

            <Animated.View style = {{flex:this.state.pressFlex}}/>
            <Animated.View style = {{flex:0.05, opacity:this.state.textOpacity}}>
                <Animatable.Text ref = 'wifi' animation='fadeIn' style = {styles.concerto}>
                    {this.state.connected?'You are connected to Wi-Fi':
                    'You are not connected to Wi-Fi'}</Animatable.Text>
            </Animated.View>
            <Animated.View style = {{flex:0.12,opacity:this.state.btnOpacity,
                justifyContent:'center', alignItems:'center', backgroundColor:colors.background}}>
                <MenuButton viewFlex = {0.8}
                    flex = {0.9}
                    fontSize = {25}
                    title = 'Make Room'
                    onPress = {()=>{ this._createRoom() }}/>
            </Animated.View>
            <Animated.View style = {{flex:0.12,opacity:this.state.btnOpacity,
                justifyContent:'center', alignItems:'center', backgroundColor:colors.background}}>
                <MenuButton viewFlex = {0.8}
                    flex = {0.9}
                    fontSize = {25}
                    title = 'Join Room'
                    onPress = {()=>{ this._joinRoom() }}/>
            </Animated.View>
            <View style = {{flex:0.02}}/>
        </View>
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