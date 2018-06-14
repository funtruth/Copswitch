import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions
}   from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const { height, width } = Dimensions.get('window')

const Header = (props) => {
    const { children, icon, onPress, stickyHeader, subtitle } = props
    const { container, header, iconWrapper, iconStyle, headerText, separator, subText } = styles

    let containerStyle = [container]
    if (stickyHeader) {
        containerStyle.push({
            position: 'absolute',
            top: 10
        })
    }

    return(
        <View style={containerStyle}>
            <View style={header}>
                <TouchableOpacity style={iconWrapper} onPress={onPress}>
                    <Icon style={iconStyle} name={icon}/>
                </TouchableOpacity>
                <Text style={headerText}>{children}</Text>
            </View>
            <View style={separator}/>
            {subtitle && <Text style={subText}>{subtitle}</Text>}
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
    },
    subText: {
        fontFamily: 'BarlowCondensed-Regular',
        fontSize: 20,
        color: '#786343',
        marginBottom: 20,
        alignSelf: 'center'
    }
}

export default Header