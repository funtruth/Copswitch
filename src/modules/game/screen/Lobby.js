import React, { Component } from 'react'
import {
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'

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
        if (item.dead) icons.push('ios-hand')
        if (this.props.ready && this.props.ready[item.uid]) icons.push('md-checkmark')

        return (
            <TouchableOpacity 
                style = {styles.player}
                onPress = {this._onPress.bind(this, item)}
                activeOpacity={item.dead?1:0.2}
            >
                <LinearGradient
                    colors={['rgba(66,72,81,1)', 'rgba(50,55,61,1)']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={styles.gradient}
                />
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
    gradient: {
        position: 'absolute',
        top: 0, bottom: 0,
        left: 0, right: 0,
        borderRadius: 2,
    },
    player:{
        flex: 1,
        flexDirection:'row',
        alignItems:'center',
        padding: 8,
        margin: 4,
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
