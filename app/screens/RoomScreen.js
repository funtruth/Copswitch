
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    Text,
    Keyboard,
    Animated,
    Dimensions
}   from 'react-native';

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

    _optionPress(id){
        this.setState({
            showOptions:false
        })
    }

    _joinRoom() {
        this.props.screenProps.navigate('JoinTutorial')
    }

    _createRoom() {
        this.setState({disabled:true});

        const roomname = randomize('0',4);
        //TODO: Check if room already exists
        AsyncStorage.setItem('ROOM-KEY', roomname);


        firebase.database().ref('rooms/' + roomname).set({
            owner: firebase.auth().currentUser.uid,
            counter:1,
        }).then(()=>{
            this.props.screenProps.navigateP('CreationTutorial',roomname)
        })
    }

    render() {

        return <View style = {{position:'absolute', left:0, right:0, bottom:0, top:0,
            justifyContent:'center', alignItems:'center', backgroundColor:colors.background}}>

                <HelperButton
                    title = {'Join' + '\n' + 'Room'}
                    icon = 'key'
                    screen = {this.props.navigation.state.routeName}
                    color = {colors.lightbutton}
                    degrees = {350}
                    order = {2}
                    showOptions = {this.state.showOptions}
                    onPress = {() => {
                        this._optionPress(2)
                        this._joinRoom()
                    }}
                />
                <HelperButton
                    title = {'Create' + '\n' + 'Room'}
                    icon = 'crown'
                    screen = {this.props.navigation.state.routeName}
                    color = {colors.menubtn}
                    degrees = {190}
                    order = {1}
                    showOptions = {this.state.showOptions}
                    onPress = {() => {
                        this._optionPress(1)
                        this._createRoom()
                    }}
                />

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
                this.props.screenProps.navigateP('MafiaRoom',result)
            } else {
                if(firebase.auth().currentUser){
                    this.props.screenProps.navigate('Home')
                } else {
                    firebase.auth().signInAnonymously().then(() => {
                        this.props.screenProps.navigate('Home')
                    }).catch(function(error){alert(error)})
                }
            }
        })
    }

    render() {
        return <View/>
    }
}