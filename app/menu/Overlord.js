import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { changeSection, toggleMenu } from './MenuReducer';

import ListNavigator from './ListNavigator';
import MenuButton from './common/MenuButton';


class Overlord extends Component {
    render() {
        const { visible, section, toggleMenu } = this.props
        return (
            <View>
                {visible?<ListNavigator onClose = {() => toggleMenu(visible)}/>:null}
                <MenuButton onPress = {() => toggleMenu(visible)}/>
            </View>
        )
    }
}

export default connect(

    state => ({
        visible: state.menu.visible,
        section: state.menu.section
    }),

    dispatch => {
        return {
            toggleMenu: (payload) => dispatch(toggleMenu(payload)),
            changeSection: () => dispatch(changeSection())
        }
    }

) (Overlord)