import React, { Component } from 'react'
import {
    View,
    Text,
}   from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

class EmptyView extends Component {
    render() {
        return (
            <View style={styles.item}>
                <Icon
                    name="ios-leaf"
                    size={25}
                    color="#fff"
                />
                <Text style={styles.subtitle}>
                    {`There is\nnothing here`}
                </Text>
            </View>
        )
    }
}

const styles = {
    item: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    subtitle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        color: '#e6e6e6',
        textAlign: 'center',
    },
}

export default EmptyView