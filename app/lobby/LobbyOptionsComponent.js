
import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    Dimensions,
}   from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
const AnimatedOpacity = Animated.createAnimatedComponent(TouchableOpacity)

import colors from '../misc/colors.js';
import firebaseService from '../firebase/firebaseService.js';

class LobbyOptionsComponent extends Component {

    constructor(props) {
        super(props);

        this.width = Dimensions.get('window').width,
        this.height = Dimensions.get('window').height

    }

    _leaveRoom() {

        firebaseService.leaveLobby()

        this.props.navigate('Home')
        
    }

    _startGame() {

        firebaseService.startGame()
        
    }

    render(){
        return <Animated.View style = {{
            height:this.height*0.1, 
            flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
    
                <AnimatedOpacity
                    style = {{alignItems:'center', flex:0.17}}
                    onPress = {() => this._leaveRoom()}>
                    <FontAwesome name='close'
                        style={{color:colors.font, fontSize:25}}/>
                    <Text style = {styles.font}>Leave</Text>
                </AnimatedOpacity>

                <AnimatedOpacity
                    style = {{alignItems:'center', flex:0.20}}
                    onPress = {() => this._startGame()}
                    //disabled = {!this.props.owner}
                >
                    <FontAwesome name={this.props.owner?'check':'lock'}
                        style={{color:this.props.owner?colors.font:colors.dead, fontSize:35}}/>
                    <Text style = {[styles.font,{color:this.props.owner?colors.font:colors.dead}]}>Start</Text>
                </AnimatedOpacity>

                <AnimatedOpacity
                    style = {{alignItems:'center', flex:0.17}}
                    onPress = {this.props.menu}>
                    <FontAwesome name='bars'
                        style={{color:colors.font, fontSize:25}}/>
                    <Text style = {styles.font}>Roles</Text>
                </AnimatedOpacity>

        </Animated.View>
    }
}

const styles = {
    font: {
        fontFamily: 'FredokaOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
}

export default LobbyOptionsComponent