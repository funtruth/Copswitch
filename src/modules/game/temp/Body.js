import React, { Component } from 'react'
import {
    View,
}   from 'react-native'
import { connect } from 'react-redux'

import { Tabs } from '../config'

class Body extends Component {
    _renderBody = (item, index) => {
        if (item.key !== this.props.mainView) return null
        return (
            <item.Component key={index}/>
        )
    }

    render() {
        return (
            <View style={styles.body}>
                {Tabs.map(this._renderBody)}
            </View>
        )
    }
}

const styles = {
    body: {
        flex: 1,
    },
    tabs: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: '#b6b6b6',
    },
    item: {
        alignItems: 'center',
        flex: 0.3,
    },
    title: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
    },
}

export default connect(
    state => ({
        mainView: state.game.mainView,
    }),
)(Body)