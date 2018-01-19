import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import { Layout } from "./router";
import { Helper } from './app/components/Helper.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            screen:'Home'
        }

      }

    _receiveNav(navigation){
        this.navigation = navigation
    }

    _navigate(screen){
        this.setState({
            screen:screen
        })
        console.log('Setting screen state in index')
    }

    render(){
        return <View style = {{flex:1}}>
            <Layout 
                screenProps={{
                    passNavigation:val=>{this._receiveNav(val)},
                    navigate:val=>{this._navigate(val)}
                }}
            />
            <Helper 
                onClick = {val => {this._onClick(val)}}
                navigation = {this.navigation}
                screen = {this.state.screen}
            />
        </View>;
    }
}

AppRegistry.registerComponent('Huddle', () => App);