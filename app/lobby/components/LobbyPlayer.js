import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import firebaseService from '../../firebase/firebaseService';

const LobbyPlayer = ({ name, showOwner, showEdit }) => {
    const { container, icon, playerName } = styles
    const displayName = name && name.toUpperCase()

    return (
        <View style={container}>
            {showOwner?<Icon style={icon} name='star-half-o'/>:null}
            <Text style={playerName}>{displayName}</Text>
            {showEdit?
                <TouchableOpacity>
                    <Icon style={icon} name='pencil'/>
                </TouchableOpacity>
            :null}
        </View>
    )
}

const styles = {
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        fontSize: 25,
        color: '#A6895D'
    },
    playerName: {
        fontFamily: 'BarlowCondensed-Medium',
        fontSize: 24,
        color: '#A6895D',
        margin: 5
    }
}

export default LobbyPlayer