//DEPRECIATED

import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    Text,
    Keyboard,
    Animated,
    Dimensions,
    TouchableOpacity,
    TextInput
}   from 'react-native';

import * as Animatable from 'react-native-animatable';
import randomize from 'randomatic';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const AnimatedOpacity = Animated.createAnimatedComponent(TouchableOpacity)

import { Alert } from '../components/Alert.js';
import { About } from '../components/About.js';
import { Button } from '../components/Button.js';
import { RuleBook } from './ListsScreen.js';

import { Slide } from '../parents/Slide.js';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import Rolesheet from '../misc/roles.json';

//Firebase
import firebase from '../firebase/FirebaseController.js';
import firebaseService from '../firebase/firebaseService.js';

export class Home extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            section: null,
            about: false,
        }

        this.height = Dimensions.get('window').height;
        this.width = Dimensions.get('window').width;

    }

    _renderMenu(){
        return <TouchableOpacity style = {{
            opacity:0.5,
            flexDirection:'row', alignItems:'center',
            position:'absolute', top:20, left:20}}
            onPress = {()=> {} }>
            <FontAwesome name='gears'
                style={{color:colors.font,fontSize:30}}/>
            <Text style = {{marginLeft:15, color:colors.font,fontFamily:'FredokaOne-Regular'}}>Options</Text>
        </TouchableOpacity>
    }

    _renderChoice(){
        return <View style = {{ alignItems:'center' }}>
        
            <TouchableOpacity style = {{ flexDirection:'row', alignItems:'center', justifyContent:'center',
                backgroundColor:colors.box, borderRadius:5, marginBottom:5, height:this.height*0.07, width:this.width*0.97 }}
                onPress = {()=> this.setState({section:'join'}) }>
                <MaterialCommunityIcons name='human-greeting'
                    style={{color:colors.font,fontSize:30}}/>
                <Text style = {{marginLeft:15, color:colors.font,fontFamily:'FredokaOne-Regular'}}>
                    Join a Room</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style = {{ flexDirection:'row', alignItems:'center', justifyContent:'center',
                backgroundColor:colors.box, borderRadius:5, marginBottom:5, height:this.height*0.07, width:this.width*0.97 }}
                onPress = {()=> firebaseService.createRoom() }>
                <FontAwesome name='edit'
                    style={{color:colors.font,fontSize:30}}/>
                <Text style = {{marginLeft:15, color:colors.font,fontFamily:'FredokaOne-Regular'}}>
                    Create a Room</Text>
            </TouchableOpacity>

            <TouchableOpacity style = {{ flexDirection:'row', alignItems:'center', justifyContent:'center',
                backgroundColor:colors.box, borderRadius:5, marginBottom:5, height:this.height*0.07, width:this.width*0.97 }}
                onPress = {()=> {} }>
                <FontAwesome name='book'
                    style={{color:colors.font,fontSize:30}}/>
                <Text style = {{marginLeft:15, color:colors.font,fontFamily:'FredokaOne-Regular'}}>
                    How to Play</Text>
            </TouchableOpacity>

        </View>
    }

    _renderAbout(){
        return <TouchableOpacity style = {{
            opacity:0.3,
            flexDirection:'row', alignItems:'center',
            position:'absolute', bottom:20, left:20}}
            onPress = {()=> {} }>
            <FontAwesome name='question-circle'
                style={{color:colors.font,fontSize:30}}/>
            <Text style = {{marginLeft:15, color:colors.font,fontFamily:'FredokaOne-Regular'}}>About the App</Text>
        </TouchableOpacity>
    }

    render() {

        return <View style = {{flex:1}}>

            <View style = {{flex:1, justifyContent:'center'}}>
                <Alert visible = {this.state.section=='join'} flex = {0.3}>
                    <Join {...this.props.screenProps}/>
                </Alert>

                <Alert justify visible = {this.state.section=='create'} flex = {0.3}>
                    <Build {...this.props.screenProps}/>
                </Alert>
            </View>

            <Alert flex = {0.5} visible = {this.state.section == 'menu'}>
                <RuleBook screenProps = {{ quit:false }}/>
            </Alert>

            {this._renderMenu()}

            {this._renderChoice()}


        </View>
    }
}

export class Loading extends React.Component {
    
    constructor(props) {
        super(props);
    }

    reset(){
        AsyncStorage.removeItem('GAME-KEY')
        AsyncStorage.removeItem('ROOM-KEY')
    }

    componentWillMount() {

        if(!firebase.auth().currentUser){
            firebase.auth().signInAnonymously()
        }

        //this.reset()

        this.props.screenProps.passNavigation(this.props.navigation)

        AsyncStorage.getItem('GAME-KEY',(error,result)=>{
            
            //result = '0028'

            if(result != null){
                this.props.screenProps.navigate('Mafia',result)
            } else {
                AsyncStorage.getItem('ROOM-KEY',(error,result)=>{
                    if(result != null){
                        this.props.screenProps.navigate('Lobby',result)
                    } else {
                        this.props.screenProps.navigate('Home')
                    }
                })
                    
            }
        })
    }

    render() {
        return <View/>
    }
}

class Build extends React.Component {
    
    constructor(props) {
        super(props);   
    }

    _createRoom(){
        firebaseService.createRoom()
    }

    render() {

        return <View>

            <Text style = {[styles.roomcode,{marginBottom:10}]}>CREATE</Text>

            <Button
                horizontal={0.35}
                color = {colors.dead}
                backgroundColor = {colors.box}
                onPress={()=>this._createRoom()}
            >
                <Text style = {styles.create}>Go!</Text>
            </Button>

        </View>
    }
}

class Join extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errormessage:'Must be 4 Digits long',
        };
        
    }

    _text(code){
        if(code.length == 4){
            Keyboard.dismiss()
            firebase.database().ref('rooms').child(code).once('value', snap => {
                if(snap.exists() && (snap.val().counter == 0)){
                    AsyncStorage.setItem('ROOM-KEY', code)
                    
                    .then(()=>{ this.props.navigate('Lobby',code) })
                } else {
                    this.setState({errormessage:'Invalid Room Code'})
                    this.refs.error.shake(800)
                    this.refs.textInput.focus()
                }
            })
        }
    }

    render() {

        return <View>

            <Text style = {styles.roomcode}>JOIN</Text>

            <Text style = {[styles.roomcode,{color:colors.font, fontSize:18, marginBottom:5}]}>Enter Roomcode</Text>

            <View style = {{justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                <TextInput
                    ref='textInput'
                    keyboardType='numeric' 
                    maxLength={4}   
                    placeholder='9999'
                    placeholderTextColor={colors.dead}
                    style={[styles.textInput,{flex:0.4}]}
                    onChangeText={val=>this._text(val)}
                />
            </View>

            <Animatable.Text style = {[styles.sfont,{marginTop:10}]}ref='error'>
                    {this.state.errormessage}</Animatable.Text>

        </View>
    }
}