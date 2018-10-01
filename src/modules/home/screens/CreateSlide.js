import React, { Component } from 'react'
import {
    Dimensions
}   from 'react-native'
import { connect } from 'react-redux'
import { createRoom } from '../HomeReducer'
import LinearGradient from 'react-native-linear-gradient'

import { Header } from '@components'
import CreateGameList from '../components/CreateGameList'
import NavigationTool from '../../navigation/NavigationTool'

const { height, width } = Dimensions.get('window')

class CreateSlide extends Component {
    _onIconPress = () => {
        NavigationTool.back()
    }

    render() {
        const { createRoom } = this.props
        const { container } = styles

        return(
            <LinearGradient colors={['#3A2F26', '#2E2620']} style={container}>
                <Header 
                    icon='angle-left' 
                    onPress={this._onIconPress}
                    stickyHeader
                    children='CREATE ROOM'
                    subtitle='DOUBLE TAP A GAME MODE TO SELECT'
                />
                <CreateGameList
                    createRoom={createRoom}
                />
            </LinearGradient>
        )
    }
}

const styles = {
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
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