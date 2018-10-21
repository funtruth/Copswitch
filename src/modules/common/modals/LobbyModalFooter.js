import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'

class LobbyModalFooter extends Component {
    _renderButton = (item) => {
        return (
            <TouchableOpacity
                key={item.key}
                style={styles.button}
                onPress={this._onPress.bind(this, item.type)}
            >
                <Text style={styles.buttonText}>
                    {item.text}
                </Text>
            </TouchableOpacity>
        )
    }

    _onPress = (type) => {
        if (type === 'close') {
            
        }
    }

    render() {
        return (
            <View style={styles.footer}>
                {this.props.buttons ? 
                    this.props.buttons.map(this._renderButton)
                    :<View style={{ height: 8 }}/>
                }
            </View>
        )
    }
}

const styles = {
    footer: {
        width: '100%',
    },
    button: {
        height: 30,
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        color: '#fff',
    }
}

export default LobbyModalFooter