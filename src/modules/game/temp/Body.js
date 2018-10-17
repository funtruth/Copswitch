import React, { Component } from 'react'
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
}   from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'

import { showViewByKey } from '../GameReducer'
import News from '../screen/News'
import GameChoice from '../screen/GameChoice'
import Events from '../screen/Events'

const tabs = [
    {
        label: 'News',
        icon: 'ios-megaphone',
        key: 'news',
        Component: News
    },
    {
        label: 'Game',
        icon: 'ios-home',
        key: 'lobby',
        Component: GameChoice,
    },
    {
        label: 'Events',
        icon: 'ios-paper-plane',
        key: 'events',
        Component: Events,
    }
]

class Body extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabIndex: 1
        }
    }

    _renderBody = (item, index) => {
        if (item.key !== this.props.mainView) return null
        return (
            <item.Component key={index}/>
        )
    }

    _renderTab = (item, index) => {
        const selected = this.state.tabIndex === index
        return (
            <TouchableOpacity
                key={item.label}
                style={[
                    styles.item,
                    selected && { transform: [{ scale: 1.1 }]}
                ]}
                onPress={this._onPress.bind(this, index, item.key)}
                activeOpacity={0.6}
            >
                <Icon
                    name={item.icon}
                    size={25}
                    color={selected?'#66c0f4':"#fff"}
                />
                <Text
                    style={[
                        styles.title,
                        selected && { color: '#66c0f4' }
                    ]}
                >{item.label}</Text>
            </TouchableOpacity>
        )
    }

    _onPress = (index, key) => {
        this.props.showViewByKey(key)
        this.setState({
            tabIndex: index
        })
    }

    render() {
        return (
            <View style={styles.body}>
                {tabs.map(this._renderBody)}
                <View style={styles.tabs}>
                    {tabs.map(this._renderTab)}
                </View>
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
    {
        showViewByKey,
    }
)(Body)