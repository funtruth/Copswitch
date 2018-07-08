import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { toggleMenu } from './MenuReducer'
import MenuSwiper from './common/MenuSwiper';

class MenuContainer extends Component {
    render() {
        const { visible, routes, toggleMenu } = this.props
        const { container } = styles

        if (!visible) return null
        return (
            <TouchableOpacity
                style={container}
                onPress={toggleMenu}
                activeOpacity={1}
            >
                <MenuSwiper routes={routes}/>
            </TouchableOpacity>
        )
    }
}

const styles = {
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center'
    }
}

export default connect(
    state => ({
        visible: state.menu.visible,
        routes: state.menu.routes
    }),
    dispatch => {
        return {
            toggleMenu: () => dispatch(toggleMenu())
        }
    }
) (MenuContainer)