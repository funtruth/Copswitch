import React, { Component } from 'react'
import { 
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Dimensions
} from 'react-native'
import { connect } from 'react-redux'
import { gameChoice } from '../GameReducer'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Styler } from '@common'
import { Separator } from '@components'
import { formatUtil } from '@services';

const { height, width } = Dimensions.get('window')

class PlayerListView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        this.updateList(this.props)
    }

    componentWillReceiveProps(newProps) {
        this.updateList(newProps)
    }

    updateList(props) {
        let { placeList, lobbyList } = props
        if (!placeList || !lobbyList) return

        this.setState({
            data: formatUtil.join(placeList, lobbyList)
        })
    }

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
                            style={{fontSize:15, alignSelf:'center'}}/>
                    </View>
                    <View style = {{flex:0.7, justifyContent:'center'}}>
                        <Text style = {styles.player}>{item.name}</Text>
                    </View>
                    <View style={{flex:0.15}}/>
                </View>
            </TouchableOpacity>
        )
    }

    _onPress(item){
        //TODO algorithm that takes my roleid and target to see if valid ... THEN continue
        this.props.gameChoice(item.key)
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
                    <Text style={styles.header1}>Who are you</Text>
                    <Text style={styles.header2}>Visiting?</Text>
                    <FlatList
                        data={this.state.data}
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
        fontFamily: Styler.fontFamily.Medium,
        fontSize: 19
    },
    header2: {
        fontFamily: Styler.fontFamily.Regular,
        fontSize: 25
    },
    player: {
        fontFamily: Styler.fontFamily.Regular,
        fontSize: 16,
        alignSelf: 'center',
        margin: 5
    }
}

export default connect(
    state => ({
        roleid: state.game.roleid,
        placeList: state.lobby.placeList,
        lobbyList: state.lobby.lobbyList
    }),
    dispatch => {
        return {
            gameChoice: (choice) => dispatch(gameChoice(choice))
        }
    }
)(PlayerListView)
