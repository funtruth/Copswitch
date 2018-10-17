import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'

class LobbyModalFooter extends Component {
    render() {
        return (
            <View style={styles.footer}>
                <Text style={styles.title}>{this.props.title}</Text>
            </View>
        )
    }
}

const styles = {
    footer: {
        height: 30,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        color: '#fff',
        marginLeft: 8,
    }
}

export default LobbyModalFooter