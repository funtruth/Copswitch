import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Keyboard,
    ActivityIndicator,
    KeyboardAvoidingView,
    Dimensions
}   from 'react-native'
import { connect } from 'react-redux'
import { checkRoom } from '../HomeReducer'
import LinearGradient from 'react-native-linear-gradient'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CodeInput from '../components/JoinCodeInput'

import colors from '../../misc/colors.js'
import { Header } from '../../components';
import NavigationTool from '../../navigation/NavigationTool';

const { height, width } = Dimensions.get('window')

class JoinSlide extends Component {
    _onIconPress = () => {
        NavigationTool.back()
    }

    render() {
        const { container, headerText, subText, separator,
            submitButton, submitText } = styles

        return(
            <LinearGradient colors={['#3A2F26', '#2E2620']} style={container}>
                <View style={{flex:0.2}}/>
                <Header icon='chevron-left' onPress={this._onIconPress}>JOIN ROOM</Header>
                <Text style={subText}>ENTER THE 4-DIGIT CODE:</Text>
                <CodeInput
                    onFulfill={this.props.checkRoom}
                />
                <TouchableOpacity style={submitButton}>
                    <Text style={submitText}>SUBMIT</Text>
                </TouchableOpacity>
            </LinearGradient>
        )
    }
}

const styles = {
    container:{
        flex: 1,
        alignItems: 'center'
    },
    headerText: {
        fontFamily: 'BarlowCondensed-Medium',
        fontSize: 35,
        color: '#A6895D'
    },
    separator: {
        width,
        height: 2,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#A6895D'
    },
    subText: {
        fontFamily: 'BarlowCondensed-Regular',
        fontSize: 20,
        color: '#786343'
    },
    submitButton: {
        width: 0.45*width,
        backgroundColor: '#A6895D',
        borderRadius: 2,
        alignItems: 'center'
    },
    submitText: {
        fontFamily: 'BarlowCondensed-Medium',
        fontSize: 25,
        color: '#372C24',
        margin: 10
    }
}

export default connect(
    null,
    dispatch => {
        return {
            checkRoom: (roomId) => dispatch(checkRoom(roomId))
        }
    }
)(JoinSlide)