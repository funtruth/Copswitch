import React, { Component } from 'react';
import { FlatList } from 'react-native';

import MenuScreen from '../screens/MenuScreen';
import DetailScreen from '../screens/DetailScreen';

import { Author } from '@library'
const { Screens, ScreenTypes } = Author

class MenuSwiper extends Component {
    _renderItem = ({item}) => {
        switch(Screens[item]) {
            case ScreenTypes.menu:
                return <MenuScreen route={item}/>
            case ScreenTypes.detail:
                return <DetailScreen item/>
            default:
                return null
        }
    }

    _keyExtractor = (item, index) => index.toString()

    render() {
        const { routes } = this.props

        return(
            <FlatList
                data={routes}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
            />
        )
    }
}

export default MenuSwiper