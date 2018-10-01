import React, { Component } from 'react'
import {
    View,
    Text,
    Dimensions
}   from 'react-native'
import { connect } from 'react-redux'
import { checkRoom, reset } from '../HomeReducer'
import LinearGradient from 'react-native-linear-gradient'
import CodeHandler from '../components/JoinCodeHandler'

import { Header, Button } from '@components';
import NavigationTool from '../../navigation/NavigationTool'

const { height, width } = Dimensions.get('window')

class JoinSlide extends Component {
    _onIconPress = () => {
        this.props.reset()
        NavigationTool.back()
    }

    render() {
        const { checkRoom, error } = this.props
        const { container, errorText } = styles

        return(
            <LinearGradient colors={['#3A2F26', '#2E2620']} style={container}>
                <View style={{flex:0.1}}/>
                <Header
                    icon={'angle-left'}
                    onPress={this._onIconPress}
                    children={'JOIN ROOM'}
                    subtitle={'ENTER THE 4-DIGIT CODE:'}
                />
                <CodeHandler
                    onFulfill={checkRoom}
                    error={error}
                />
                <View style={{flex:0.1}}>
                    <Text style={errorText}>
                        {error}
                    </Text>
                </View>
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
    errorText: {
        fontFamily: 'BarlowCondensed-Regular',
        fontSize: 20,
        color: '#A6895D',
        marginTop: 10,
        textAlign: 'center'
    }
}

export default connect(
    state => ({
        error: state.home.error
    }),
    dispatch => {
        return {
            checkRoom: (roomId) => dispatch(checkRoom(roomId)),
            reset: () => dispatch(reset())
        }
    }
)(JoinSlide)