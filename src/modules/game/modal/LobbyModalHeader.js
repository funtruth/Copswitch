import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { Constants } from '../config'

class LobbyModalHeader extends Component {
    render() {
        return (
            <View style={styles.header}>
                <Text style={styles.title}>{this.props.title}</Text>
                <TouchableOpacity
                    style={styles.closeButton}
                    hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}
                    onPress={this.props.onClose}
                >
                    <Icon name="ios-close" size={30} color="#fff"/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = {
    header: {
        height: Constants.modalHeaderHeight,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    closeButton: {
        marginLeft: 'auto',
        marginRight: 8,
    },
    title: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        color: '#fff',
        marginLeft: 8,
    }
}

export default LobbyModalHeader