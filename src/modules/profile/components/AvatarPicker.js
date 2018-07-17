import React, { Component } from 'react'
import { FlatList } from 'react-native'

class AvatarPicker extends Component {
    _renderItem = ({item}) => {

    }

    _keyExtractor = (item) => item.key

    render() {
        return (
            <FlatList
                data={null}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
                horizontal
            />
        )
    }
}

export default AvatarPicker