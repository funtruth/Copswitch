import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const REST_HEIGHT = 45

export default class BottomIcon extends Component {
    render() {
        const { name, size, color, onPress } = this.props

        return (
            <TouchableOpacity
                style={{
                    height: REST_HEIGHT, width: REST_HEIGHT,
                    justifyContent: 'center', alignItems: 'center',
                }}
                onPress={onPress}
                activeOpacity={0.5}
            >
                <Icon
                    name={name}
                    size={size}
                    color={color}
                />
            </TouchableOpacity>
        )
    }
}