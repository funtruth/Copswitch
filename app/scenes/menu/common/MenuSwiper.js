import React, { Component } from 'react';
import { View } from 'react-native';

import MenuScreen from './screens/MenuScreen';
import DetailScreen from './screens/DetailScreen';

class MenuSwiper extends Component {
    render() {
        return(
            <View style = {{flex:1}}>
                <Menu />
            </View>
        )
    }
}

export default MenuSwiper