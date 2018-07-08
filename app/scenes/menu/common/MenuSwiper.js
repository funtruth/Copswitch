import React, { Component } from 'react';
import { View, FlatList, Dimensions, TouchableOpacity } from 'react-native';

import MenuScreen from '../screens/MenuScreen';
import DetailScreen from '../screens/DetailScreen';

import { Styler } from '@common'
import { Author } from '@library'
const { Screens, ScreenTypes } = Author
const { height, width } = Dimensions.get('window')

class MenuSwiper extends Component {
    componentWillReceiveProps(newProps) {
        if (newProps.routes !== this.props.routes) {
            //TODO less hacky solution
            setTimeout(() => this.refs.listRef.scrollToEnd(), 500)
        }
    }

    _renderItem = ({item}) => {
        switch(Screens[item]) {
            case ScreenTypes.menu:
                return <MenuScreen route={item}/>
            case ScreenTypes.detail:
                return <DetailScreen route={item}/>
            default:
                return null
        }
    }

    _keyExtractor = (item, index) => index.toString()

    render() {
        const { routes } = this.props
        const { container, screen } = styles

        return(
            <TouchableOpacity style={container} activeOpacity={1}>
                <FlatList
                    ref={'listRef'}
                    data={routes}
                    renderItem={this._renderItem}
                    contentContainerStyle={screen}
                    horizontal
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={this._keyExtractor}
                />
            </TouchableOpacity>
        )
    }
}

const styles = {
    container: {
        top: Styler.constant.menuHeaderHeight,
        width: Styler.constant.menuWidth
    },
    screen: {
        height: Styler.constant.menuHeight
    }
}

export default MenuSwiper