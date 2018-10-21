import React, { Component } from 'react'
import {
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

class Lobby extends Component {
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
                onPress = {() => this._onPress(item)}
                activeOpacity={item.dead?1:0.2}
            >
                <Text style = {styles.name}>{item.name}</Text>
                {icons.map(this._renderIcon)}
            </TouchableOpacity>
        )
    }

    _onPress = () => {
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
        flex: 1,
        backgroundColor: '#1e2125',
    },
    player:{
        flexDirection:'row',
        alignItems:'center',
    },
    name: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        margin: 3,
        marginLeft: 8,
        color: '#a8a8a8',
    },
}

export default connect(
    state => ({
        lobby: state.lobby.lobby,
        ready: state.lobby.ready,
    }),
)(Lobby)
