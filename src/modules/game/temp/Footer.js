import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
}   from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'

import { showViewByKey } from '../GameReducer'
import { Tabs, Constants } from '../config'

class Footer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabIndex: 1
        }
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
            <View style={styles.tabs}>
                {Tabs.map(this._renderTab)}
            </View>
        )
    }
}

const styles = {
    tabs: {
        height: Constants.footerHeight,
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
    null,
    {
        showViewByKey,
    }
)(Footer)