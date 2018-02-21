
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const AnimatedOpacity = Animated.createAnimatedComponent(TouchableOpacity)

import { Alert } from '../components/Alert.js';
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
            section: null,
        }

        this.height = Dimensions.get('window').height

    }

    _navPress(section){
        if(this.state.section == section) this.setState({section:null})
        else this.setState({ section:section })
    }

    _renderNav(){
        return <Animated.View style = {{ flexDirection:'row', justifyContent:'center' }}>
    
            <TouchableOpacity style = {{
                justifyContent:'center', alignItems:'center', flex:0.2}}
                onPress = {()=> this._navPress('crea') }>
                <FontAwesome name='cloud'
                    style={{color:colors.font,fontSize:30}}/>
                <Text style = {{color:colors.font,fontFamily:'FredokaOne-Regular'}}>Create</Text>
            </TouchableOpacity>
    
            <TouchableOpacity style = {{
                justifyContent:'center', alignItems:'center', flex:0.25}}
                onPress = {()=> this._navPress('join') }>
                <FontAwesome name='key'
                    style={{color:colors.font,fontSize:40}}/>
                <Text style = {{color:colors.font,fontFamily:'FredokaOne-Regular'}}>Join</Text>
            </TouchableOpacity>
    
            <TouchableOpacity style = {{
                justifyContent:'center', alignItems:'center', flex:0.2}}
                onPress = {()=> this._navPress('menu') }>
                <FontAwesome name='book'
                    style={{color:colors.font,fontSize:30}}/>
                <Text style = {{color:colors.font,fontFamily:'FredokaOne-Regular'}}>Menu</Text>
            </TouchableOpacity>

        </Animated.View>
    }

    render() {

        return <View style = {{flex:1, justifyContent:'center', alignItems:'center'}}>

            <Alert flex = {0.1} visible = {this.state.section == 'crea'}>
                <Build visible = {this.state.section == 'crea'}
                    navigate = {(val)=> this.props.screenProps.navigate('Lobby',val)}/>
            </Alert>

            <Alert flex = {0.3} visible = {this.state.section == 'join'}>
                <Join navigate = {(val)=> this.props.screenProps.navigate('Lobby',val)}/>
            </Alert>

            <Alert flex = {0.5} visible = {this.state.section == 'menu'}>
                <RuleBook
                    screenProps = {{
                        quit:false
                    }}
                />
            </Alert>
            
            {this._renderNav()}

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
            roomname:null,
            message:'Almost there!',
        };
        
    }

    _createRoom() {

        AsyncStorage.setItem('ROOM-KEY', this.state.roomname)
        .then(()=>{ this.props.navigate(this.state.roomname) })
    }

    componentWillReceiveProps(newProps){

        if(newProps.visible && !this.state.roomname){

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
            }) 
        }
    }

    render() {

        return <View>

            <Button
                horizontal={0.4}
                onPress={()=>this._createRoom()}
            >
                <Text style = {styles.create}>Create Room</Text>
            </Button>

        </View>
    }
}

class Join extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            roomname:null,
            errormessage:'Must be 4 Digits long',
        };

        this.height = Dimensions.get('window').height;
        this.width = Dimensions.get('window').width;
        
    }

    _continue(roomname) {
        if(roomname.length==4){
            firebase.database().ref('rooms/' + roomname).once('value', snap => {
                if(snap.exists() && (snap.val().counter == 0)){
                    this._joinRoom(roomname)
                } else if (snap.exists() && (snap.val().counter > 0)) {
                    setTimeout(()=>{
                        this.setState({errormessage:'Game has already started'})
                        this.refs.error.shake(800)
                    },800)
                } else {
                    setTimeout(()=>{
                        this.setState({errormessage:'Invalid Room Code'})
                        this.refs.error.shake(800)
                    },800)
                        
                }
            })
                
        } else {
            this.setState({errormessage:'Code must be 4 Digits long'})
            this.refs.error.shake(800)
        }
    }

    _joinRoom(roomname) {
        AsyncStorage.setItem('ROOM-KEY', roomname).then(()=>{
            this.props.navigate(roomname)
        })
    }

    render() {

        return <View>

            <Text style = {styles.roomcode}>CODE</Text>

            <View style = {{justifyContent:'center', 
            alignItems:'center', flexDirection:'row'}}>
                <TextInput
                    ref='textInput'
                    keyboardType='numeric' 
                    maxLength={4}   
                    placeholder='9999'
                    placeholderTextColor={colors.dead}
                    value={this.state.roomname}
                    style={[styles.textInput,{flex:0.5}]}
                    onChangeText={val=>this.setState({roomname:val})}
                    onSubmitEditing={event=>this._continue(event.nativeEvent.text)}
                />
            </View>

            <Animatable.Text style = {[styles.sfont,{marginTop:10}]}ref='error'>
                    {this.state.errormessage}</Animatable.Text>

        </View>
    }
}