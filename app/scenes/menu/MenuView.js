import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import MenuSwiper from './common/MenuSwiper';
import MenuHeader from './common/MenuHeader';


class MenuView extends Component {
    render() {
        const { visible } = this.props
        return (
            <View>
                {visible?<MenuSwiper />:null}
                <MenuHeader />
            </View>
        )
    }
}

export default connect(
    state => ({
        visible: state.menu.visible
    })
) (MenuView)