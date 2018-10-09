import React, { Component } from 'react';
import { View, BackHandler } from 'react-native';

import AppNavigator from "../modules/navigation/AppNavigator";
import AndroidHandler from '../components/AndroidHandler'
import NavigationTool from '../modules/navigation/NavigationTool'
import DevTool from '../components/dev/DevTool';

export default class Router extends Component {
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
                <AndroidHandler/>
                <AppNavigator
                    ref = {navigatorRef => {
                        NavigationTool.setContainer(navigatorRef)
                    }}
                />
                {__DEV__?<DevTool />:null}
            </View>
        )
    }
}

const styles = {
    container : {
        flex: 1
    }
}