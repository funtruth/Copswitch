import React, { Component } from 'react'
import { View, FlatList, Dimensions } from 'react-native'
import { connect } from 'react-redux' 
import firebaseService from '../../firebase/firebaseService';
import LobbyPlayer from '../components/LobbyPlayer';

const { height, width } = Dimensions.get('window')

class LobbyPlayerView extends Component {
    state = {
        data: []
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.lobbyList || !newProps.placeList) return

        let placeSnapshot = newProps.placeList
        let lobbySnapshot = newProps.lobbyList
        let data = []

        const myUid = firebaseService.getUid()

        placeSnapshot.forEach(child => {
            let playerUid = child.val()
            data.push({
                key: playerUid,
                name: lobbySnapshot.val()[playerUid] && lobbySnapshot.val()[playerUid].name,
                uid: playerUid,
                showOwner: playerUid === newProps.owner,
                showEdit: playerUid === myUid
            })
        })

        this.setState({
            data: data
        })
    }

    renderPlayer = ({item}) => <LobbyPlayer {...item}/>

    keyExtractor = (item) => item.key

    render() {
        const { lobbyList } = this.props
        const { container } = styles

        return (
            <View style={container}>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderPlayer}
                    keyExtractor={this.keyExtractor}
                />
            </View>
        )
    }
}

const styles = {
    container: {
        height: 0.55*height,
        width
    }
}

export default connect(
    state => ({
        owner: state.lobby.owner,
        lobbyList: state.lobby.lobbyList,
        placeList: state.lobby.placeList
    })
)(LobbyPlayerView)