import React from 'react'
import { TextInput } from 'react-native'

const Input = (props) => {
    return (
        <TextInput
            underlineColorAndroid={'transparent'}
            placeholderTextColor={'#8E8782'}
            { ...props }
            style={[styles.defaultStyle, props.style]}
        />
    )
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