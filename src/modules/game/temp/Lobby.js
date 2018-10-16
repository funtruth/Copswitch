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
    _renderItem = ({item}) => {
        const iconName = item.dead?'skull':
            (item.readyvalue?'check-circle':
                (item.immune?'needle':
                    (item.status?item.statusname:null)))
        return (
            <TouchableOpacity 
                style = {{
                    opacity: item.dead?0.6:1,
                    justifyContent:'center',
                    alignItems:'center',
                    width: 0.5 * width,
                }}
                onPress = {() => this._onPress(item)}
                activeOpacity={item.dead?1:0.2}
            >
                <LinearGradient
                    colors={['#407999', '#2a3e59']}
                    start={{x: 0.2, y: 0}}
                    end={{x: 0.8, y: 0}}
                    style = {styles.gradient}
                >
                    <View style = {{flex:0.15,justifyContent:'center',alignItems:'center'}}>
                        <Icon
                            name={iconName}
                            style={{fontSize:15, alignSelf:'center'}}
                            color="#fff"
                        />
                    </View>
                    <View style = {{flex:0.7, justifyContent:'center'}}>
                        <Text style = {styles.player}>{item.name}</Text>
                    </View>
                    <View style={{flex:0.15}}/>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    _onPress(item){
        //TODO algorithm that takes my roleid and target to see if valid ... THEN continue
        this.props.playerChoice(item.uid)
    }
    
    render() {
        return (
            <FlatList
                data={this.props.lobby}
                renderItem={this._renderItem}
                numColumns={2}
                keyExtractor={item => item.uid}
            />
        )
    }
}

const styles = {
    gradient: {
        flexDirection:'row',
        borderRadius: 3,
        padding: 5,
        margin: 3,
    },
    header1: {
        fontFamily: 'Roboto-Medium',
        fontSize: 19
    },
    header2: {
        fontFamily: 'Roboto-Medium',
        fontSize: 25
    },
    player: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        alignSelf: 'center',
        margin: 5,
        color: '#fff',
    }
}

export default connect(
    state => ({
        lobby: state.lobby.lobby,
    }),
    {
        playerChoice,
    }
)(Lobby)
