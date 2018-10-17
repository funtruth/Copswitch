import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Commands from './commands'

const devBotHeight = 200

class DevTool extends Component {
    state = {
        visible: false
    }

    _visible = () => {
        this.setState({
            visible: !this.state.visible
        })
    }

    renderButtons = () => {
        const { buttons } = styles
        if (!this.state.visible) return null
        
        return (
            <View style={buttons}>
                <FlatList
                    data={Commands}
                    renderItem={this.renderButton}
                    keyExtractor={this.keyExtractor}
                />
            </View>
        )
    }

    renderButton = ({item}) => {
        const { button, font } = styles
        const { buttonText, onPress } = item

        return (
            <TouchableOpacity style={button} onPress={onPress}>
                <Text style={font}>{buttonText}</Text>
            </TouchableOpacity>
        )
    }

    keyExtractor = (item, index) => item.key
    
    render() {
        const { idle, icon, container } = styles
        if (!__DEV__) return null
        return (
            <View style={container}>
                {this.renderButtons()}
                <TouchableOpacity style={idle} onPress={this._visible}>
                    <Icon style={icon} name='gear'/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = {
    container: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'transparent'
    },
    idle: {
        height: 40,
        width: 40,
        alignSelf: 'flex-end'
    },
    icon: {
        fontSize: 25,
        color: '#E3C382'
    },
    buttons: {
        height: devBotHeight,
        width: devBotHeight,
        alignItems: 'center'
    },
    button: {
        height: 40,
        width: 180,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#A6895D',
        borderRadius: 2
    },
    font: {
        fontFamily: 'BarlowCondensed-Medium',
        fontSize: 15,
        color: '#372C24'
    }
}

export default DevTool