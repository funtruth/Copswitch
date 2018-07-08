import React, { Component } from 'react';
import { View, BackHandler } from 'react-native';

import Router from "./router";
import { NavigationTool } from '@navigation';
import { DevBot } from '@services';

import MenuHeader from '../scenes/menu/common/MenuHeader';
import MenuContainer from '../scenes/menu/MenuContainer';

export default class Helper extends React.Component {
    componentDidMount(){
        BackHandler.addEventListener("hardwareBackPress", this._onBackPress.bind(this));
    }

    componentWillUnmount(){
        BackHandler.removeEventListener("hardwareBackPress");
    }

    _onBackPress(){
        return true
    }

    render() {

        return (
            <View style = {styles.container}>
                <Router
                    ref = {navigatorRef => {
                        NavigationTool.setContainer(navigatorRef)
                    }}
                />
                <MenuContainer />
                <MenuHeader />
                {__DEV__?<DevBot />:null}
            </View>
        )
    }
}

const styles = {
    container : {
        flex: 1
    }
}