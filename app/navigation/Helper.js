import React, { Component } from 'react';
import { View, Text, Animated, BackHandler } from 'react-native';

import colors from '../misc/colors.js';
import { NavigationActions } from 'react-navigation';

import Router from "./router";
import NavigationTool from './NavigationTool.js';
import DevBot from '../devTools/DevBot.js';

export class Helper extends React.Component {
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