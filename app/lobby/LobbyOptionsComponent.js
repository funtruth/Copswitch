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

        this.state = {
            ownerFlag: false
        }

        this.width = Dimensions.get('window').width,
        this.height = Dimensions.get('window').height

    }

    componentWillMount() {

        //import all listeners
        this.infoRef = firebaseService.fetchRoomInfoRef('owner')
        
        this.infoRef.on('value',snap=>{
            if(snap.exists()){
                this.setState({
                    ownerFlag: snap.val() == firebaseService.getUid()
                })
            }
        })

    }

    componentWillUnmount(){
        if(this.infoRef) this.infoRef.off()
    }

    _exit() {

        if(this.state.ownerFlag) firebaseService.deleteRoom()
        else firebaseService.leaveLobby()

        this.props.navigate('Home')
        
    }

    _startGame() {

        if(this.state.ownerFlag){
            firebaseService.startGame()
        }

    }

    render(){
        return <Animated.View style = {{
            height:this.height*0.1, 
            flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
    
                <AnimatedOpacity
                    style = {{alignItems:'center', flex:0.17}}
                    onPress = {() => this._exit()}>
                    <FontAwesome name='close'
                        style={{color:colors.font, fontSize:25}}/>
                    <Text style = {styles.font}>Leave</Text>
                </AnimatedOpacity>

                <AnimatedOpacity
                    style = {{alignItems:'center', flex:0.20}}
                    onPress = {() => this._startGame()}
                    disabled = {!this.state.ownerFlag}
                >
                    <FontAwesome name={this.state.ownerFlag?'check':'lock'}
                        style={{color:this.state.ownerFlag?colors.font:colors.dead, fontSize:35}}/>
                    <Text style = {[styles.font,{color:this.state.ownerFlag?colors.font:colors.dead}]}>Start</Text>
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