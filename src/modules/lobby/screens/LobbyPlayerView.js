import React, { Component } from 'react'
import { View, FlatList, Dimensions } from 'react-native'
import { connect } from 'react-redux' 
import { firebaseService } from '@services'
import LobbyPlayer from '../components/LobbyPlayer';

const { height, width } = Dimensions.get('window')

class LobbyPlayerView extends Component {
    state = {
        data: []
    }

    componentDidMount() {
        this.updateList(this.props)
    }

    componentWillReceiveProps(newProps) {
        this.updateList(newProps)
    }

    updateList(props) {
        let { placeList, lobbyList, owner } = props
        if (!lobbyList || !placeList) return

        let data = []
        const myUid = firebaseService.getUid()

        placeList.forEach(child => {
            const uid = child.val()
            data.push({
                key: uid,
                name: lobbyList[uid] && lobbyList[uid].name,
                fullName: lobbyList[uid] && lobbyList[uid].fullName,
                uid: uid,
                showOwner: uid === owner,
                showEdit: uid === myUid
            })
        })

        this.setState({
            data: data
        })
    }

    renderPlayer = ({item}) => <LobbyPlayer {...item}/>

    keyExtractor = (item) => item.key

    render() {
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
        height: 0.7*height,
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