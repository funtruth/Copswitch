import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Keyboard,
    ActivityIndicator
}   from 'react-native';
import { connect } from 'react-redux';
import { changeSection } from './HomeReducer';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Join from './JoinRoomComponent';
import Create from './CreateRoomComponent'

import colors from '../misc/colors.js';
import firebaseService from '../firebase/firebaseService';

class BasicHomeScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading:false,
            errorMessage:'Must be 4 Digits long',
        };
        
    }

    //Valid roomcode format
    onChange(code){

        if(!this.state.loading && code.length == 4){

            Keyboard.dismiss()
            this.setState({
                loading:true,
                status:'Checking Room',
            })
            this.checkRoom(code)

        }
    }

    async checkRoom(code){

        const { valid, message } = await firebaseService.checkRoom(code);

        this.setState({ status:message })

        if(valid){
            AsyncStorage.setItem('ROOM-KEY', code)
            .then(()=>{

                firebaseService.joinRoom(code)
                this.props.screenProps.navigate('Lobby',code)
                
                this.setState({ errorMessage:'Must be 4 Digits long' })
                
            })
        } else {
            this.refs.roomCode.focus()
        }

        this.setState({
            loading:false,
            status:'Enter Roomcode'
        })

    }

    _createRoom = async () => {
        
        this.setState({
            loading:true
        })

        const roomId = await firebaseService.createRoom()
        
        this.props.screenProps.navigate('Lobby',roomId)

        this.setState({
            loading:false
        })

    }

    render() {
        return( 
            <View>
                <View style = {{height:50}}/>
                <View style = {styles.container}>
                    <View style = {{ margin: 10 }}>
                        <View style = {styles.titleContainer}>
                            <FontAwesome name = 'star' style = {styles.iconStyle} />
                            <Text style = {styles.titleStyle}>Join</Text>
                        </View>
                        <TextInput
                            ref='roomCode'
                            keyboardType='numeric' 
                            maxLength={4}   
                            placeholder='Enter your 4 digit code'
                            placeholderTextColor={colors.dead}
                            style={styles.textInput}
                            onChangeText={val=>this.onChange(val)}
                        />
                        <Text style = {styles.subtitleStyle}>Ask the room owner for the code!</Text>
                    </View>
                </View>

                <TouchableOpacity 
                    style = {styles.container} 
                    onPress = { this._createRoom }
                    activeOpacity = {0.9}
                >
                    <View style = {{ margin: 10 }}>
                        <View style = {styles.titleContainer}>
                            <FontAwesome name = 'edit' style = {styles.iconStyle} />
                            <Text style = {styles.titleStyle}>Create</Text>
                            <ActivityIndicator
                                animating = { this.state.loading } 
                                size = "large"
                                color = { colors.shadow }
                                style = { styles.indicator }
                            />
                        </View>
                        <Text style = {styles.subtitleStyle}>Customize your own room!</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = {
    container:{
        marginTop:20,
        marginLeft:20,
        marginRight:20,
        backgroundColor: colors.lightgrey,
        borderRadius: 5
    },
    iconStyle:{
        fontSize: 25,
        marginLeft:5
    },
    titleContainer:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:5
    },
    titleStyle:{
        fontSize:30,
        fontFamily: 'LuckiestGuy-Regular',
        marginLeft:10
    },
    subtitleStyle:{
        fontSize:16,
        marginLeft:5
    },
    textInput: {
        fontSize: 16,
        color: colors.shadow,
        fontWeight:'bold'
    },
    indicator:{
        marginLeft: 20
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