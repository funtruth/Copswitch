import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Commands from './commands'

const COMMAND1 = 'ADD_PLAYER'

class DevBot extends Component {
    onPress1 = () => {
        Commands[COMMAND1].function()
    }
    
    render() {
        return (
            <View style={styles.location}>
                <TouchableOpacity style={styles.button} onPress={this.onPress1}>
                    <Text>{Commands[COMMAND1].button}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = {
    location: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: 200,
        width: 200,
        backgroundColor: 'rgba(0,0,83,0.8)'
    },
    button: {
        height: 50,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center'
    }
}

export default DevBot