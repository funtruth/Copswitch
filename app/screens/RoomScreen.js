
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

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const AnimatedOpacity = Animated.createAnimatedComponent(TouchableOpacity)

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import randomize from 'randomatic';

const QUICK_ANIM    = 400;
const MED_ANIM      = 600;
const SLOW_ANIM     = 1000;

const MARGIN = 10;

import { Alert } from '../components/Alert.js';
import { Join1, Build1 } from './LobbyScreen.js';
import Menu from './ListsScreen.js';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import Rolesheet from '../misc/roles.json';

//Firebase
import firebase from '../firebase/FirebaseController.js';

export class Home extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            nav: new Animated.Value(1),
            wiggle: new Animated.Value(0),

            crea: false,
            join: false,
            menu: false,
        }

        this.width = Dimensions.get('window').width
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

    _stop(){
        const animation = Animated.timing(
            this.state.wiggle, {
                toValue:1,
                duration:5000
            }
        )
        
        Animated.loop(animation).stop()
    }

    _navPress(crea,join,menu){
        this.setState({
            crea:crea?!this.state.crea:false,
            join:join?!this.state.join:false,
            menu:menu?!this.state.menu:false,
        })
    }

    componentWillMount(){
        //this._bounce()
    }

    _renderNav(){
        return <Animated.View style = {{
            transform: [{
                scale:this.state.wiggle.interpolate({
                    inputRange: [0,0.5,1],
                    outputRange: [1,1.05,1]
                })
            }],
            height:this.height*0.1, flexDirection:'row', justifyContent:'center'
        }}>
    
            <TouchableOpacity style = {{
                justifyContent:'center', alignItems:'center', flex:0.2}}
                onPress = {()=> this._navPress(true,false,false) }>
                <FontAwesome name='cloud'
                    style={{color:colors.font,fontSize:30,textAlign:'center'}}/>
                <Text style = {{color:colors.font,fontFamily:'FredokaOne-Regular'}}>Create</Text>
            </TouchableOpacity>
    
            <TouchableOpacity style = {{
                justifyContent:'center', alignItems:'center', flex:0.25}}
                onPress = {()=> this._navPress(false,true,false) }>
                <FontAwesome name='key'
                    style={{color:colors.font,fontSize:40,textAlign:'center'}}/>
                <Text style = {{color:colors.font,fontFamily:'FredokaOne-Regular'}}>Join</Text>
            </TouchableOpacity>
    
            <TouchableOpacity style = {{
                justifyContent:'center', alignItems:'center', flex:0.2}}
                onPress = {()=> this._navPress(false,false,true) }>
                <FontAwesome name='book'
                    style={{color:colors.font,fontSize:30,textAlign:'center'}}/>
                <Text style = {{color:colors.font,fontFamily:'FredokaOne-Regular'}}>Menu</Text>
            </TouchableOpacity>

        </Animated.View>
    }

    render() {

        return <View style = {{position:'absolute', left:0, right:0, bottom:0, top:0,
            justifyContent:'center', alignItems:'center'}}>

            <Alert flex = {0.1} visible = {this.state.crea}>
                <Build1 visible = {this.state.crea}
                    navigate = {(val)=> this.props.screenProps.navigateP('Lobby',val)}/>
            </Alert>

            <Alert flex = {0.3} visible = {this.state.join}>
                <Join1 navigate = {(val)=> this.props.screenProps.navigateP('Lobby',val)}/>
            </Alert>

            <Alert flex = {0.4} visible = {this.state.menu}>
                <Menu />
            </Alert>
            
            {this._renderNav()}

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
                this.props.screenProps.navigateP('Mafia',result)
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