import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
}   from 'react-native'
import { connect } from 'react-redux'
import { createRoom } from '../HomeReducer'
import LinearGradient from 'react-native-linear-gradient'

import { Header, Button } from '../../components';
import NavigationTool from '../../navigation/NavigationTool';

const { height, width } = Dimensions.get('window')

class CreateSlide extends Component {
    _onIconPress = () => {
        NavigationTool.back()
    }

    render() {
        const { createRoom } = this.props
        const { container, headerText, subText, separator,
            submitButton, submitText } = styles

        return(
            <LinearGradient colors={['#3A2F26', '#2E2620']} style={container}>
                <View style={{flex:0.2}}/>
                <Header icon='chevron-left' onPress={this._onIconPress}>CREATE ROOM</Header>
                <Text style={subText}>SELECT A GAME MODE:</Text>
                <Button style={submitButton} onPress={createRoom}>
                    <Text style={submitText}>DONE</Text>
                </Button>
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
        color: '#786343',
        marginBottom: 20
    },
    submitButton: {
        width: 0.45*width,
        height: 0.15*width
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
            createRoom: (roomId) => dispatch(createRoom(roomId))
        }
    }
)(CreateSlide)