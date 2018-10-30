import React, { Component } from 'react'
import {
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'

import {db} from '@services'
import {modalType} from '../../common/types'

import { showModalByKey } from '../../common/ViewReducer'

class Lobby extends Component {
    _onPress = () => {
        this.props.showModalByKey(modalType.myName)
    }

    _renderIcon = (item) => {
        return (
            <Icon
                key={item}
                name={item}
                size={18}
                color="#fff"
                style={{ marginRight: 8 }}
            />
        )
    }

    _renderItem = ({item}) => {
        let icons = []
        let meFlag = item.uid === db.getUid()
        let isOwner = item.uid === this.props.owner
        if (meFlag) icons.push('md-create')
        if (isOwner) icons.push('ios-star')

        return (
            <TouchableOpacity 
                style={styles.player}
                onPress={this._onPress}
                disabled={!meFlag}
            >
                <Text style = {styles.name}>{item.name}</Text>
                {icons.map(this._renderIcon)}
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <FlatList
                data={this.props.lobby}
                renderItem={this._renderItem}
                contentContainerStyle={styles.flatlist}
                keyExtractor={item => item.uid}
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
        backgroundColor: '#1e2125',
        width: '100%',
        padding: 12,
        marginBottom: 8,
        borderRadius: 2,
    },
    name: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        marginLeft: 8,
        marginRight: 8,
        color: '#fff',
    },
}

export default connect(
    state => ({
        owner: state.lobby.config.owner,
        lobby: state.lobby.lobby,
        ready: state.lobby.ready,
    }),
    {
        showModalByKey,
    }
)(Lobby)
