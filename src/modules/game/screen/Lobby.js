import React, { Component } from 'react'
import {
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { playerChoice } from '../GameReducer'

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
        if (item.dead) icons.push('skull')
        if (this.props.ready && this.props.ready[item.uid]) icons.push('check-circle')

        return (
            <TouchableOpacity 
                style = {styles.player}
                onPress = {this._onPress.bind(this, item)}
                activeOpacity={item.dead?1:0.2}
            >
                <Text style = {styles.name}>{item.name}</Text>
                {icons.map(this._renderIcon)}
            </TouchableOpacity>
        )
    }

    _onPress = (item) => {
        //algorithm that checks, returns error if not applicable
        this.props.playerChoice(item.uid)
    }

    render() {
        return (
            <FlatList
                data={this.props.lobby}
                renderItem={this._renderItem}
                contentContainerStyle={styles.flatlist}
                numColumns={2}
                keyExtractor={item => item.uid}
            />
        )
    }
}

const styles = {
    flatlist: {
        padding: 11,
    },
    player:{
        flex: 1,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: '#384959',
        padding: 10,
        margin: 4,
        borderRadius: 2,
    },
    name: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        margin: 3,
        marginLeft: 8,
        color: '#fff',
    },
}

export default connect(
    state => ({
        lobby: state.lobby.lobby,
        ready: state.lobby.ready,
    }),
    {
        playerChoice,
    }
)(LobbyList)
