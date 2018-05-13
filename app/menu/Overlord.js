import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { changeSection, toggleMenu } from './MenuReducer';

import ListNavigator from './ListNavigator';
import MenuButton from './common/MenuButton';


class Overlord extends Component {

    render() {

        const { visible, section, toggleMenu } = this.props

        if( visible ) return <ListNavigator onClose = {() => toggleMenu(visible)}/>
        
        return <MenuButton onPress = {() => toggleMenu(visible)}/>
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