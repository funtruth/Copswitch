
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

import { CustomButton } from '../components/CustomButton.js';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
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

        const roomname = randomize('0',4);
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
            <CustomButton
                size = {0.12}
                flex = {0.85}
                opacity = {1}
                depth = {8}
                color = {colors.menubtn}
                radius = {50}
                fontSize = {24}
                title = 'Create Room'
                onPress = {()=>{ 
                    this._createRoom()
                }}
                disabled = {this.state.disabled}
            />
            <View style = {{flex:0.02}}/>
            <CustomButton
                size = {0.12}
                flex = {0.85}
                opacity = {1}
                depth = {8}
                color = {colors.menubtn}
                radius = {50}
                fontSize = {24}
                title = 'Join Room'
                onPress = {()=>{
                    this._joinRoom()
                }}
                disabled = {this.state.disabled}
            />
            <View style = {{flex:0.12}}/>

        </View>
    }
}

export class Loading extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            message: 'Tap to Start!',
            disabled: false,
        }

        const { params } = this.props.navigation.state;
        this._function = params._function;

        this.scale = new Animated.Value(0.4);
    }
    
    componentWillMount() {
        AsyncStorage.getItem('GAME-KEY',(error,result)=>{
            if(result != null){
                this.props.navigation.dispatch(
                    NavigationActions.navigate({
                        routeName: 'Mafia',
                        action: NavigationActions.navigate({ 
                            routeName: 'MafiaRoom',
                            params: {
                                roomname:result,
                                _function:this._function
                            }
                        })
                    })
                )
            } else {
                if(firebase.auth().currentUser){
                    this.props.navigation.dispatch(
                        NavigationActions.reset({
                            index: 0,
                            key: null,
                            actions: [
                                NavigationActions.navigate({ 
                                    routeName: 'SignedIn',
                                    params: {
                                        _function:this._function
                                    }
                                })
                            ]
                        })
                    )
                } else {
                    firebase.auth().signInAnonymously().then(() => {
                        this.props.navigation.dispatch(
                            NavigationActions.reset({
                                index: 0,
                                key: null,
                                actions: [
                                    NavigationActions.navigate({ 
                                        routeName: 'SignedIn',
                                        params: {
                                            _function:this._function
                                        }
                                    })
                                ]
                            })
                        )
                    }).catch(function(error){alert(error)})
                    
                }
            }
        })
    }

    render() {
        return <View/>
    }
}