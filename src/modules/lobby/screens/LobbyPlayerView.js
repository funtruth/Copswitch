import React, { Component } from 'react'
import { View, FlatList, Dimensions } from 'react-native'

import LobbyPlayer from '../components/LobbyPlayer';

const { height, width } = Dimensions.get('window')

class LobbyPlayerView extends Component {
    renderPlayer = ({item}) => <LobbyPlayer {...item}/>

    keyExtractor = (item) => item.uid

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.props.lobby}
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

export default LobbyPlayerView