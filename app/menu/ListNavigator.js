import React, { Component } from 'react';
import { View } from 'react-native';

import Modal from '../common/Modal';

import BasicMenu from './screens/BasicMenuScreen';
import Roles from './screens/RoleScreen';
import Menus from './screens/MenuScreen';
import InfoPage from './screens/InfoPageScreen';

import { StackNavigator } from 'react-navigation';

const Menu = StackNavigator(
    {
        BasicMenu: {
            screen: BasicMenu,
        },
        Roles: {
            screen: Roles,
        },
        Menus: {
            screen: Menus,
        },
        InfoPage: {
            screen: InfoPage,
        },
    },
    {
        initialRouteName: 'BasicMenu',
        headerMode: 'none',
        cardStyle: {backgroundColor: 'transparent', justifyContent:'center'}
    }
);

class ListNavigator extends Component {

    constructor(props){
        super(props)
    }
    
    render() {
        return(
            <View style = {{flex:1}}>
                <Modal visible = {true} onClose = {this.props.onClose}>
                    <Menu />
                </Modal>
            </View>
        )
    }
}

export default ListNavigator