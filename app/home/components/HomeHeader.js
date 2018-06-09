import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions
}   from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import NavigationTool from '../../navigation/NavigationTool';

const { height, width } = Dimensions.get('window')

const _backPressed = () => {
    NavigationTool.back()
}

const HomeHeader = (props) => {
    const { header, iconWrapper, icon, headerText, separator } = styles

    return(
        <View>
            <View style={header}>
                <TouchableOpacity style={iconWrapper} onPress={_backPressed}>
                    <Icon style={icon} name='chevron-left'/>
                </TouchableOpacity>
                <Text style={headerText}>{props.children}</Text>
            </View>
            <View style={separator}/>
        </View>
    )
}

const styles = {
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconWrapper: {
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        fontSize: 25,
        color: '#A6895D'
    },
    headerText: {
        flex: 0.8,
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
        backgroundColor: '#A6895D'
    }
}

export default HomeHeader