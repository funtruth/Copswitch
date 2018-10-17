import React, { Component } from 'react'
import { 
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Dimensions
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import LinearGradient from 'react-native-linear-gradient';

import { playerChoice } from '../GameReducer'

const { height, width } = Dimensions.get('window')

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

    _onPress(item){
        if (this.props.myReady)
        //TODO algorithm that takes my roleid and target to see if valid ... THEN continue
        this.props.playerChoice(item.uid)
    }
    
    render() {
        return (
            <FlatList
                data={this.props.lobby}
                renderItem={this._renderItem}
                numColumns={2}
                contentContainerStyle={styles.flatlist}
                keyExtractor={item => item.uid}
            />
        )
    }
}

const styles = {
    flatlist: {
        alignItems: 'center',
        paddingTop: 15,
    },
    player:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        padding: 5,
        margin: 3,
        width: 0.45 * width,
        backgroundColor: '#384959',
    },
    name: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        alignSelf: 'center',
        margin: 5,
        color: '#fff',
    }
}

export default connect(
    state => ({
        lobby: state.lobby.lobby,
        ready: state.lobby.ready,
        myReady: state.game.myReady,
    }),
    {
        playerChoice,
    }
)(Lobby)
