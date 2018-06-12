import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions
}   from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const { height, width } = Dimensions.get('window')

const Header = ({ children, icon, onPress }) => {
    const { container, header, iconWrapper, iconStyle, headerText, separator } = styles

    return(
        <View style={container}>
            <View style={header}>
                <TouchableOpacity style={iconWrapper} onPress={onPress}>
                    <Icon style={iconStyle} name={icon}/>
                </TouchableOpacity>
                <Text style={headerText}>{children}</Text>
            </View>
            <View style={separator}/>
        </View>
    )
}

const styles = {
    container: {
        width
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconWrapper: {
        flex: 0.15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconStyle: {
        fontSize: 25,
        color: '#A6895D'
    },
    headerText: {
        flex: 0.7,
        fontFamily: 'BarlowCondensed-Medium',
        fontSize: 35,
        color: '#A6895D',
        textAlign: 'center'
    },
    separator: {
        width,
        height: 2,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#A6895D',
        alignSelf: 'center'
    }
}

export default Header