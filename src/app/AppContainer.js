import React, { Component } from 'react';
import { View, BackHandler } from 'react-native';

import Navigator from "../navigation/Navigator";
import { NavigationTool } from '@navigation';
import { DevBot } from '@services';

import MenuHeader from '../menu/common/MenuHeader';
import MenuContainer from '../menu/MenuContainer';

export default class Router extends React.Component {
    componentDidMount(){
        BackHandler.addEventListener("hardwareBackPress", this._onBackPress.bind(this));
    }

    componentWillUnmount(){
        BackHandler.removeEventListener("hardwareBackPress");
    }

    _onBackPress(){
        return false
    }

    render() {

        return (
            <View style = {styles.container}>
                <Navigator
                    ref = {navigatorRef => {
                        NavigationTool.setContainer(navigatorRef)
                    }}
                />
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