
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
import { HelperButton } from '../components/HelperButton.js';

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

            showOptions: false,
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

    componentDidMount() {
        setTimeout(()=>{
            this.setState({
                showOptions:true
            })
        },1000)
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
            this.props.navigation.navigate('CreationTutorial',{roomname:roomname})
            
            setTimeout(() => {
                this.props.screenProps.showCover(false)
                
                this.setState({disabled: false})
            }, 600);
        })
    }

    _joinRoom() {
        this.setState({disabled:true});
        setTimeout(() => {

            this.setState({disabled: false})
            this.props.navigation.navigate('JoinTutorial')
        
            this.props.screenProps.showCover(false)

        }, 600);

        
    }

    render() {

        return <View style = {{position:'absolute', left:0, right:0, bottom:0, top:0,
            justifyContent:'center', alignItems:'center', backgroundColor:colors.background}}>

                <HelperButton
                    title = {'Join' + '\n' + 'Room'}
                    icon = 'key'
                    color = {colors.lightbutton}
                    degrees = {340}
                    order = {2}
                    showOptions = {this.state.showOptions}
                    onPress = {() => {
                        this.props.screenProps.showCover(true)
                        this._joinRoom()
                    }}
                />
                <HelperButton
                    title = {'Create' + '\n' + 'Room'}
                    icon = 'crown'
                    color = {colors.menubtn}
                    degrees = {200}
                    order = {1}
                    showOptions = {this.state.showOptions}
                    onPress = {() => {
                        this.props.screenProps.showCover(true)
                        this._createRoom()
                    }}
                />

        </View>

        return <View style = {{ flex:1, backgroundColor:colors.beige }}>

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
                    this.props.screenProps.showCover(true)
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
                    this.props.screenProps.showCover(true)
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
    }
    
    componentWillMount() {

        this.props.screenProps.passNavigation(this.props.navigation)

        AsyncStorage.getItem('GAME-KEY',(error,result)=>{
            if(result != null){
                this.props.navigation.navigate('MafiaRoom',{roomname:result})
            } else {
                if(firebase.auth().currentUser){
                    this.props.navigation.navigate('Home')
                } else {
                    firebase.auth().signInAnonymously().then(() => {
                        this.props.navigation.navigate('Home')
                    }).catch(function(error){alert(error)})
                }
            }
        })
    }

    componentDidMount() {
        this.props.screenProps.showCover(false)
    }

    render() {
        return <View/>
    }
}