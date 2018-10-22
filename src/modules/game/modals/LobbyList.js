import React, { Component } from 'react'
import {
    View,
    Text,
    FlatList,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'

import {modalType} from '../../common/types'
import LobbyModal from '../../common/modals/LobbyModal';

class LobbyList extends Component {
    _renderIcon = (item) => {
        return (
            <Icon
                key={item}
                name={item}
                size={15}
                color="#fff"
            />
        )
    }

    _renderItem = ({item}) => {
        let icons = []
        if (item.dead) icons.push('ios-hand')
        if (this.props.ready && this.props.ready[item.uid]) icons.push('md-checkmark')

        return (
            <View
                style = {[
                    styles.player
                ]}
            >
                <Text style = {styles.name}>{item.name}</Text>
                <View style={{ marginLeft: 'auto' }}/>
                {icons.map(this._renderIcon)}
            </View>
        )
    }

    render() {
        return (
            <LobbyModal
                type={modalType.lobby}
                title="List of Players"
            >
                <FlatList
                    data={this.props.lobby}
                    renderItem={this._renderItem}
                    contentContainerStyle={styles.flatlist}
                    numColumns={2}
                    keyExtractor={item => item.uid}
                />
            </LobbyModal>
        )
    }
}

const styles = {
    flatlist: {
        flex: -1,
    },
    player:{
        flex: 1,
        flexDirection:'row',
        alignItems:'center',
        margin: 4,
        backgroundColor: '#1e2125',
        paddingLeft: 8,
        paddingRight: 8,
    },
    name: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        margin: 4,
        color: '#dfdfdf',
    },
}

export default connect(
    state => ({
        lobby: state.lobby.lobby,
        ready: state.lobby.ready,
    }),
)(LobbyList)
