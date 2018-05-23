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
import { onChangeCode, createRoom } from './HomeReducer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../misc/colors.js';
import firebaseService from '../firebase/firebaseService';

class BasicHomeScreen extends Component {
    render() {
        return( 
            <View>
                <View style = {{height:50}}/>
                <View style = {styles.container}>
                    <View style = {{margin: 10}}>
                        <View style = {styles.titleContainer}>
                            <FontAwesome name = 'star' style = {styles.iconStyle} />
                            <Text style = {styles.titleStyle}>Join</Text>
                        </View>
                        <TextInput
                            ref = 'roomCode'
                            keyboardType = 'numeric' 
                            maxLength = {4}   
                            placeholder = 'Enter your 4 digit code'
                            placeholderTextColor = {colors.dead}
                            style = {styles.textInput}
                            value = { this.props.joinId }
                            onChangeText = { this.props.onChangeCode }
                        />
                        <Text style = {styles.subtitleStyle}>{this.props.errorText}</Text>
                    </View>
                </View>

                <TouchableOpacity 
                    style = {styles.container} 
                    onPress = { this.props.createRoom }
                    activeOpacity = {0.9}
                >
                    <View style = {{ margin: 10 }}>
                        <View style = {styles.titleContainer}>
                            <FontAwesome name = 'edit' style = {styles.iconStyle} />
                            <Text style = {styles.titleStyle}>Create</Text>
                            <ActivityIndicator
                                animating = { this.props.loading } 
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
        joinId: state.home.joinId,
        loading: state.home.loading,
        errorText: state.home.errorText
    }),
    dispatch => {
        return {
            onChangeCode: (payload) => dispatch(onChangeCode(payload)),
            createRoom: () => dispatch(createRoom()) 
        } 
    }
)(BasicHomeScreen)