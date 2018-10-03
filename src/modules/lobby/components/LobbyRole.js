import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Announcer, Roles } from '@library'
const { Defaults } = Announcer

const LobbyRole = ({ roleId, count }) => {
    const { container, playerName, description, countText } = styles
    const { name, rules } = Roles[roleId]

    return (
        <TouchableOpacity style={container}>
            <View style={{flex:0.7}}>
                <Text style={playerName}>{name}</Text>
                <Text style={description}>{rules}</Text>
            </View>
            <View style={{flex:0.2}}>
                <Text style={countText}>{count}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = {
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    playerName: {
        fontFamily: 'BarlowCondensed-Medium',
        fontSize: 24,
        color: '#A6895D',
        margin: 5
    },
    description: {
        fontFamily: 'BarlowCondensed-Medium',
        fontSize: 18,
        color: '#A6895D',
        margin: 5
    },
    countText: {
        fontFamily: 'BarlowCondensed-Medium',
        fontSize: 20,
        color: '#A6895D'
    }
}

export default LobbyRole