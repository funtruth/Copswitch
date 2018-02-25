
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

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import Rolesheet from '../misc/roles.json';

//Firebase
import firebase from '../firebase/FirebaseController.js';

export class Home extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            about: false,
        }

    }

    _renderMenu(){
        return <TouchableOpacity style = {{
            flexDirection:'row', alignItems:'center',
            position:'absolute', top:20, left:20}}
            onPress = {()=> this._navPress('menu') }>
            <FontAwesome name='book'
                style={{color:colors.font,fontSize:30}}/>
            <Text style = {{marginLeft:15, color:colors.font,fontFamily:'FredokaOne-Regular'}}>How to Play</Text>
        </TouchableOpacity>
    }

    _renderAbout(){
        return <TouchableOpacity style = {{
            flexDirection:'row', alignItems:'center',
            position:'absolute', bottom:20, left:20}}
            onPress = {()=> this._navPress('menu') }>
            <FontAwesome name='question-circle'
                style={{color:colors.font,fontSize:30}}/>
            <Text style = {{marginLeft:15, color:colors.font,fontFamily:'FredokaOne-Regular'}}>About the App</Text>
        </TouchableOpacity>
    }

    render() {

        return <View style = {{flex:1, justifyContent:'center'}}>

            <Join navigate = {(val)=> this.props.screenProps.navigate('Lobby',val)}/>

            <View style = {{flex:0.25}}/>

            <Build navigate = {(val)=> this.props.screenProps.navigate('Lobby',val)}/>


            <Alert flex = {0.5} visible = {this.state.section == 'menu'}>
                <RuleBook screenProps = {{ quit:false }}/>
            </Alert>
            
            <View style = {{flex:0.05}}/>

            {this._renderMenu()}

            <About visible = {this.state.about} flex = {0.4}/>

            {this._renderAbout()}

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

        this.state = {
            message:'Almost there!',
        };
        
    }

    _createRoom(){

        var flag = false
        var roomname = null

        firebase.database().ref('rooms').once('value',snap=>{

            while(!flag){
                roomname = randomize('0',4);
                if(!snap.child(roomname).exists()){
                    flag = true
                    this.setState({roomname:roomname})
                }
            }
            
            firebase.database().ref('rooms/').child(roomname).set({
                owner: firebase.auth().currentUser.uid,
                counter:0,
            })

            .then(()=>{
                AsyncStorage.setItem('ROOM-KEY', roomname)
            })

            .then(()=>{ this.props.navigate(roomname) })
        }) 
    }

    render() {

        return <View>

            <Text style = {[styles.roomcode,{marginBottom:10}]}>CREATE</Text>

            <Button
                horizontal={0.35}
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
                    AsyncStorage.setItem('ROOM-KEY', code).then(()=>{
                        this.props.navigate(code)
                    })
                } else if (snap.exists() && (snap.val().counter > 0)) {
                    this.setState({errormessage:'Game has already started'})
                    this.refs.error.shake(800)
                    this.refs.textInput.focus()
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