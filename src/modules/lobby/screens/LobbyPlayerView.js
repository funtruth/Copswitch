import React, { Component } from 'react'
import { View, FlatList, Dimensions } from 'react-native'
import { connect } from 'react-redux' 
import { firebaseService, formatUtil } from '@services'
import LobbyPlayer from '../components/LobbyPlayer';

const { height, width } = Dimensions.get('window')

class LobbyPlayerView extends Component {
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
        console.log('placelist', placeList)
        console.log('lobby', lobbyList)
        console.log(formatUtil.join(placeList, lobbyList))
    }

    renderPlayer = ({item}) => <LobbyPlayer {...item}/>

    keyExtractor = (item) => item.uid

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
        placeList: state.lobby.placeList,
        lobbyList: state.lobby.lobbyList
    })
)(LobbyPlayerView)