
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
    Modal,
    Dimensions
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import randomize from 'randomatic';
import * as Animatable from 'react-native-animatable';

const AnimatableIcon = Animatable.createAnimatableComponent(FontAwesome)
const QUICK_ANIM    = 400;
const MED_ANIM      = 600;
const SLOW_ANIM     = 1000;

import { PushButton } from '../components/PushButton.js';
import { CustomButton } from '../components/CustomButton.js';

import colors from '../misc/colors.js';
import Rolesheet from '../misc/roles.json';

//Firebase
import firebase from '../firebase/FirebaseController.js';

export class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            connected:  true,
            disabled:   false,
            loading:    false,
        };
        
        this.width = 180,
        this.height = 320,
        this.radius = 370,

        this.connectedRef = firebase.database().ref(".info/connected");
        
    }

    componentWillMount() {
        this.connectedRef.on('value',snap=>{
            if(snap.val()==true){
                this.setState({connected:true})
            } else {
                this.setState({connected:true})
            }
        })   
    }

    componentWillUnmount() {
        if(this.connectedRef){
            this.connectedRef.off();
        }
    }

    _renderConnection() {
        return <Animatable.View ref = 'wifi' style = {{flex:0.06}}>
            <CustomButton
                size = {1}
                flex = {0.5}
                opacity = {1}
                depth = {4}
                color = {colors.menubtn}
                radius = {5}
                onPress = {()=>{ this._connection() }}
                component = {
                    <Text style = {styles.dconcerto}>
                        {this.state.connected?'connected':'disconnected'}</Text>}
            />
        </Animatable.View>
    }

    _connection() {
        this.connectedRef.once('value',snap=>{
            if(snap.val()==true){
                this.setState({connected:true})
            } else {
                this.setState({connected:false})
            }
        })   
    }

    _createRoom() {
        
        this.setState({disabled:true});

        const roomname = randomize('0',6);
        //TODO: Check if room already exists
        AsyncStorage.setItem('ROOM-KEY', roomname);


        firebase.database().ref('rooms/' + roomname).set({
            phase: 0,
            owner: firebase.auth().currentUser.uid,
            daycounter:1,
        }).then(()=>{
            
            this.props.navigation.dispatch(
                NavigationActions.navigate({
                    routeName: 'CreationTutorial',
                    action: NavigationActions.navigate({ 
                        routeName: 'CreationPager',
                        params: {roomname:roomname}
                    })
                })
            );
            setTimeout(() => {this.setState({disabled: false})}, 600);
        })
    }

    _joinRoom() {
        this.setState({disabled:true});
        setTimeout(() => {

            this.setState({disabled: false})
            this.props.navigation.dispatch(
                NavigationActions.navigate({
                    routeName: 'JoinTutorial',
                    action: NavigationActions.navigate({ 
                        routeName: 'Join1'
                    })
                })
            );
        
        }, 600);

        
    }

    render() {

        return <View style = {{ flex:1, backgroundColor:colors.background }}>

            <View style = {{flex:0.7}}/>
            
            <View style = {{flex:0.02}}/>
            <PushButton
                size = {0.12}
                opacity = {1}
                depth = {8}
                color = {colors.menubtn}
                radius = {50}
                onPress = {()=>{ 
                    this._createRoom()
                }}
                disabled = {this.state.disabled}
                component = {
                    <Text style = {styles.bconcerto}>Create Room</Text>
                }
            />
            <View style = {{flex:0.02}}/>
            <PushButton
                size = {0.12}
                opacity = {1}
                depth = {8}
                color = {colors.menubtn}
                radius = {50}
                onPress = {()=>{ this._joinRoom() }}
                disabled = {this.state.disabled}
                component = {
                    <Text style = {styles.bconcerto}>Join Room</Text>
                }
            />
            <View style = {{flex:0.12}}/>

        </View>
    }
}

export class Expired extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            message: 'LOADING',
        }
    }

    componentWillMount() {
        AsyncStorage.getItem('GAME-KEY',(error,result)=>{
            firebase.database().ref('rooms').child(result).once('value').then(()=>{
                this.setState({
                    loading:false,
                    message:'PRESS TO CONTINUE'
                })
            })
        })
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

    _renderCloseBtn() {
        return <View style = {{flexDirection:'row', flex:0.1, marginTop:10, 
            justifyContent:'center',alignItems:'center'}}>
            <View style = {{flex:0.85}}/>
            <TouchableOpacity
                style = {{flex:0.15}}
                onPress = {()=>{
                    this._resetGame()
                }} >
                <MaterialCommunityIcons name='close-circle'
                    style={{color:colors.font,fontSize:23}}/>
            </TouchableOpacity>
        </View>
    }

    _renderLoadingScreen() {
        return <View style = {{flex:0.8}}>
            <Animatable.View style ={{flex:1,justifyContent:'center', 
                alignItems:'center', position:'absolute',top:0,bottom:30,left:0,right:0}} 
                animation = 'fadeIn' duration = {1000}>
                <AnimatableIcon ref='duh' animation="swing" iterationCount='infinite' direction="alternate"
                    name='user-secret' style={{ color:colors.main, fontSize: 40 }}/>
                <Animatable.Text ref='continue' animation={{
                        0: {opacity:0},
                        0.25:{opacity:0.5},
                        0.5:{opacity:1},
                        0.75:{opacity:0.5},
                        4:{opacity:0},
                    }}
                    iterationCount="infinite" duration={2000}
                    style={styles.continue}>{this.state.message}</Animatable.Text>
            </Animatable.View>
        </View>
    }

    _onPress() {
        if(!this.state.loading){
            this._continueGame();
        } 
    }
    
    render() {
        return <TouchableWithoutFeedback
                style = {{flex:1}}
                onPress = {() => { this._onPress() }} >
                <View style = {{flex:1, backgroundColor:colors.background}}>
                    {this._renderCloseBtn()}
                    {this._renderLoadingScreen()}
                </View>
            </TouchableWithoutFeedback>
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
    dconcerto: {
        fontSize:17,
        fontFamily:'ConcertOne-Regular',
        color:colors.font,
        alignSelf: 'center',
    },
    continue: {
        fontSize:20,
        fontFamily:'ConcertOne-Regular',
        color:colors.font,
        alignSelf: 'center',
        marginTop:5
    },
    headerStyle: {
        fontSize:20,
        fontFamily: 'ConcertOne-Regular',
        color:colors.font,
    },
    bconcerto: {
        fontSize:30,
        fontFamily:'ConcertOne-Regular',
        color:colors.font,
        alignSelf: 'center',
    },

});