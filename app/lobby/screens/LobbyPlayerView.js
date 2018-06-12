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
        let snapshot = newProps.lobbyList
        let players = []

        snapshot.forEach(child => {
            players.push({
                key: child.key,
                name: child.val().name,
                uid: child.key
            })
        })

        this.setState({
            data: players
        })
    }

    renderPlayer = ({item}) => {
        const { owner } = this.props
        item.showOwner = item.uid === owner
        item.showEdit = item.uid === firebaseService.getUid()

        return <LobbyPlayer { ...item }/>
    }

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
        lobbyList: state.lobby.lobbyList
    })
)(LobbyPlayerView)