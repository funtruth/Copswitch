import React, { Component } from 'react'
import { 
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Dimensions
} from 'react-native'
import { connect } from 'react-redux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Separator from '../../components/Separator'
import Styler from '../../common/Styler'

import playerModule from '../mods/playerModule'

const { height, width } = Dimensions.get('window')

class PlayerListView extends Component {
    
    _renderItem = ({item}) => {
        const iconName = item.dead?'skull':
            (item.readyvalue?'check-circle':
                (item.immune?'needle':
                    (item.status?item.statusname:null)))
        return (
            <TouchableOpacity style = {{
                    opacity: item.dead?0.6:1,
                    justifyContent:'center',
                    alignItems:'center'
                }}
                onPress = {() => this._onPress(item)}
            >
                <View style = {{flexDirection:'row'}}>
                    <View style = {{flex:0.15,justifyContent:'center',alignItems:'center'}}>
                        <MaterialCommunityIcons name={iconName}
                            style={{color:colors.font, fontSize:15, alignSelf:'center'}}/>
                    </View>
                    <View style = {{flex:0.7, justifyContent:'center'}}>
                        <Text style = {[styles.player,Styler.fading]}>{item.name}</Text>
                    </View>
                    <View style={{flex:0.15}}/>
                </View>
            </TouchableOpacity>
        )
    }

    _onPress(item){
        playerModule.notification('You have selected ' + item.name + '.')
        playerModule.selectChoice(item.key)
    }
    
    render() {
        return (
            <View style={{
                height,
                width,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={{flex:0.7}}>
                    <Text style={[styles.header1,Styler.default]}>WhO are yOu</Text>
                    <Text style={[styles.header2,Styler.default]}>Visiting?</Text>
                    <FlatList
                        data={this.props.playerList}
                        ItemSeparatorComponent={() => <Separator/>}
                        renderItem={this._renderItem}
                        keyExtractor={item => item.uid}
                    />
                </View>
            </View>
        )
    }
}

const styles = {
    header1: {
        fontSize: 19
    },
    header2: {
        fontSize: 25
    },
    player: {
        fontSize: 16,
        alignSelf: 'center',
        margin: 5
    }
}

export default connect(
    state => ({
        playerList: state.game.playerList
    })
)(PlayerListView)
