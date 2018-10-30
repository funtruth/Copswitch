import React, { Component } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'

import {Roles} from '@library'

class RoleView extends Component {
    _onPress = (item) => {
        
    }

    _renderItem = ({item}) => {
        return (
            <TouchableOpacity 
                style={styles.player}
                onPress={this._onPress.bind(this, item)}
            >
                <View style={{ flex: 0.6 }}>
                    <Text style={styles.label}>{'Role'}</Text>
                    <Text style={styles.name}>{Roles[item.key].name}</Text>
                </View>
                <View style={{ flex: 0.3, alignItems: 'center' }}>
                    <Text style={styles.label}>{'Count'}</Text>
                    <Text style={styles.name}>{item.count}</Text>
                </View>
                <Icon name="ios-information-circle" size={25} color={'#fff'}/>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <FlatList
                data={this.props.roles}
                renderItem={this._renderItem}
                contentContainerStyle={styles.flatlist}
                keyExtractor={item => item.key}
            />
        )
    }
}

const styles = {
    flatlist: {
        padding: 8,
    },
    player:{
        flexDirection:'row',
        alignItems:'center',
        padding: 4,
        alignSelf: 'center',
    },
    label: {
        fontFamily: 'Roboto-Medium',
        fontSize: 13,
        lineHeight: 14,
        color: '#d6d6d6',
    },
    name: {
        fontFamily: 'Roboto-Regular',
        fontSize: 17,
        lineHeight: 19,
        color: '#fff',
    },
}

export default connect(
    state => ({
        roles: state.lobby.config.roles,
    }),
)(RoleView)
