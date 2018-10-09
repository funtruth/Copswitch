import React, { Component } from 'react'
import { View, FlatList, Dimensions } from 'react-native'

import LobbyRole from '../components/LobbyRole';

const { height, width } = Dimensions.get('window')

class LobbyRolesView extends Component {
    renderRole = ({item, index}) => <LobbyRole key={index} {...item}/>

    keyExtractor = (item) => item.key

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.props.data}
                    renderItem={this.renderRole}
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

export default LobbyRolesView