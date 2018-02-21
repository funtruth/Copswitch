
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    Text,
    Keyboard,
    Animated,
    Dimensions,
    TouchableOpacity
}   from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const AnimatedOpacity = Animated.createAnimatedComponent(TouchableOpacity)

import { Alert } from '../components/Alert.js';
import { Join1, Build1 } from './LobbyScreen.js';
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
            wiggle: new Animated.Value(0),

            section: null,
        }

        this.height = Dimensions.get('window').height

    }

    _bounce(){
        const animation = Animated.timing(
            this.state.wiggle, {
                toValue:1,
                duration:5000
            }
        )
        
        Animated.loop(animation).start()
    }

    _navPress(section){
        this.setState({ section:section })
    }

    _renderNav(){
        return <Animated.View style = {{ height:this.height*0.1, flexDirection:'row', justifyContent:'center' }}>
    
            <TouchableOpacity style = {{
                justifyContent:'center', alignItems:'center', flex:0.2}}
                onPress = {()=> this._navPress('crea') }>
                <FontAwesome name='cloud'
                    style={{color:colors.font,fontSize:30,textAlign:'center'}}/>
                <Text style = {{color:colors.font,fontFamily:'FredokaOne-Regular'}}>Create</Text>
            </TouchableOpacity>
    
            <TouchableOpacity style = {{
                justifyContent:'center', alignItems:'center', flex:0.25}}
                onPress = {()=> this._navPress('join') }>
                <FontAwesome name='key'
                    style={{color:colors.font,fontSize:40,textAlign:'center'}}/>
                <Text style = {{color:colors.font,fontFamily:'FredokaOne-Regular'}}>Join</Text>
            </TouchableOpacity>
    
            <TouchableOpacity style = {{
                justifyContent:'center', alignItems:'center', flex:0.2}}
                onPress = {()=> this._navPress('menu') }>
                <FontAwesome name='book'
                    style={{color:colors.font,fontSize:30,textAlign:'center'}}/>
                <Text style = {{color:colors.font,fontFamily:'FredokaOne-Regular'}}>Menu</Text>
            </TouchableOpacity>

        </Animated.View>
    }

    render() {

        return <View style = {{flex:1, justifyContent:'center', alignItems:'center'}}>

            <Alert flex = {0.1} visible = {this.state.section == 'crea'}>
                <Build1 visible = {this.state.section == 'crea'}
                    navigate = {(val)=> this.props.screenProps.navigate('Lobby',val)}/>
            </Alert>

            <Alert flex = {0.3} visible = {this.state.section == 'join'}>
                <Join1 navigate = {(val)=> this.props.screenProps.navigate('Lobby',val)}/>
            </Alert>

            <Alert flex = {0.5} visible = {this.state.section == 'menu'}>
                <RuleBook />
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
            
            result = '0028'

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