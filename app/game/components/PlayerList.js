import React, { Component } from 'react';
import { 
    View,
    FlatList,
} from 'react-native';
import { connect } from 'react-redux'

import PlayerButton from './PlayerButton';

class PlayerList extends Component {
    render() {
        return <FlatList
            data={this.props.playerList}
            contentContainerStyle={{alignSelf:'center', width:this.width*0.8}}
            renderItem={({item}) => <PlayerButton item={item}/>}
            numColumns={2}
            keyExtractor={item => item.uid}
        />
    }
}

const styles = {
    player: {
        fontSize: 16,
        fontFamily: 'FredokaOne-Regular',
        color: colors.shadow,
        margin:5,
    },
}

export default connect(
    state => ({
        playerList: state.game.playerList
    })
)(PlayerList)
