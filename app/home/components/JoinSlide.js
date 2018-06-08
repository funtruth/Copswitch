import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Keyboard,
    ActivityIndicator
}   from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import colors from '../misc/colors.js'

class JoinSlide extends Component {
    render() {
        return(
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
        )
    }
}

const styles = {
    container:{
        marginLeft:20,
        marginRight:20,
        backgroundColor: colors.lightgrey,
        borderRadius: 5
    }
}

export default JoinSlide