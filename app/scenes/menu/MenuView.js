import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import MenuSwiper from './common/MenuSwiper';

class MenuView extends Component {
    render() {
        const { visible, routes } = this.props
        const { container } = styles

        if (!visible) return null
        return (
            <View style={container}>
                <MenuSwiper routes={routes}/>
            </View>
        )
    }
}

const styles = {
    container: {
        position: 'absolute',
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
    }
}

export default connect(
    state => ({
        visible: state.menu.visible,
        routes: state.menu.routes
    })
) (MenuView)