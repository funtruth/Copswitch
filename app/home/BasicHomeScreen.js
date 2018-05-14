import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
}   from 'react-native';
import { connect } from 'react-redux';
import { changeSection } from './HomeReducer';

import { Alert } from '../components/Alert.js';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Join from './JoinRoomComponent';
import Create from './CreateRoomComponent'

import colors from '../misc/colors.js';
import firebaseService from '../firebase/firebaseService.js';

class BasicHomeScreen extends Component {

    _renderSectionButton(section, text, round){

        return (
            <TouchableOpacity 
                style = {[styles.choiceButton,round?{borderTopRightRadius:15}:null]} 
                onPress = {() => this.props.changeSection(section)}
                activeOpacity = {0.9}
            >
                <Text style = {styles.titleStyle}>{text}</Text>
            </TouchableOpacity>
        )

    }

    render() {

        return <View style = {{flex:1, justifyContent:'center'}}>

            <View style = {styles.container}>

                <View style = {{flex:0.6, flexDirection:'row'}}>

                    <View style = {styles.descContainer}>

                    </View>

                    <View style = {{flex:0.4}}>
                        {this._renderSectionButton('join','JOIN',true)}
                        {this._renderSectionButton('create','CREATE')}
                    </View>

                </View>

                <View style = {styles.titleContainer}>
                    <Text style = {styles.labelStyle}>Title Text</Text>
                    <Text style = {styles.sublabelStyle}>Subtitle Text goes here!</Text>
                </View>

            </View>

        </View>
    }
}

const styles = {
    container:{
        flex:0.35,
        //backgroundColor: 'white',
        //borderRadius:2,
        margin:5,
        //elevation:2
    },
    descContainer:{
        flex:0.6,
        backgroundColor:'white',
        margin:2,
        borderRadius:2,
        borderTopLeftRadius:15
    },
    choiceButton:{
        flex: 0.5,
        justifyContent: 'center',
        alignItems:'center',
        borderRadius:2,
        margin:2,
        elevation:2,
        backgroundColor:'white'
    },
    titleContainer:{
        flex:0.4,
        justifyContent:'center',
        margin:2,
        backgroundColor:'white',
        borderRadius: 2,
        elevation:2,
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15
    },
    titleStyle:{
        fontSize:18,
        fontWeight:'bold'
    },
    labelStyle:{
        fontSize:20,
        fontWeight:'bold',
        marginLeft:20
    },
    sublabelStyle:{
        fontSize:16,
        marginLeft:20
    }
}

export default connect(
    state => ({
        section: state.home.section
    }),
    dispatch => {
        return {
            changeSection: (payload) => dispatch(changeSection(payload))  
        } 
    }
)(BasicHomeScreen)