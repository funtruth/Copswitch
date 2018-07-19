import React, { Component } from 'react'
import { TextInput } from 'react-native'

class Input extends Component {
    render() {
        return (
            <TextInput
            underlineColorAndroid={'transparent'}
            placeholderTextColor={'#8E8782'}
            { ...this.props }
            style={[styles.defaultStyle, this.props.style]}
        />
        )
    }
}

const styles = {
    defaultStyle: {
        fontFamily:'BarlowCondensed-Regular',
        fontSize: 20,
        color: '#786343',
        backgroundColor: '#C4C4C4',
        textAlign:'center',
        justifyContent:'center',
        borderRadius: 2
    }
}

export default Input