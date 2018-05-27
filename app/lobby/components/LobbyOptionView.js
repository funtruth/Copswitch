import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Dimensions,
}   from 'react-native';
import { connect } from 'react-redux'
import { changeModalView } from '../LobbyReducer'

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import colors from '../../misc/colors.js';
import firebaseService from '../../firebase/firebaseService.js';
import NavigationTool from '../../navigation/NavigationTool.js';
const { height, width } = Dimensions.get('window')

class LobbyOptionView extends Component {

    _exit = () => {
        const { owner, username } = this.props

        if(owner) firebaseService.deleteRoom()
        else firebaseService.leaveLobby(username)

        NavigationTool.navigate('Home')        
    }

    _startGame = () => {
        if(this.props.owner){
            firebaseService.startGame()
        }
    }

    _toggleMenu = () => {
        if(this.props.modalView){
            this.props.changeModalView(null)
        } else {
            this.props.changeModalView('roles')
        }
    }

    render(){
        const { owner } = this.props
        return (
            <View style = { styles.container }>
        
                <TouchableOpacity
                    style = {{alignItems:'center', flex:0.17}}
                    onPress = {this._exit}>
                    <FontAwesome name='close'
                        style={{color:colors.font, fontSize:25}}/>
                    <Text style = {styles.font}>Leave</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style = {{alignItems:'center', flex:0.20}}
                    onPress = {this._startGame}
                    disabled = {!owner}
                >
                    <FontAwesome name={owner?'check':'lock'}
                        style={{color:owner?colors.font:colors.dead, fontSize:35}}/>
                    <Text style = {[styles.font,{color:owner?colors.font:colors.dead}]}>Start</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style = {{alignItems:'center', flex:0.17}}
                    onPress = {this._toggleMenu}>
                    <FontAwesome name='bars'
                        style={{color:colors.font, fontSize:25}}/>
                    <Text style = {styles.font}>Roles</Text>
                </TouchableOpacity>

            </View>
        )
    }
}

const styles = {
    container:{
        position: 'absolute',
        left: 15,
        right: 15,
        bottom: 15,
        height: height*0.1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    font: {
        fontFamily: 'FredokaOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
}

export default connect(
    state => ({
        modalView: state.lobby.modalView,
        owner: state.lobby.owner,
        username: state.lobby.username
    }),
    dispatch => {
        return {
            changeModalView: (modalView) => dispatch(changeModalView(modalView))
        }
    }
)(LobbyOptionView)