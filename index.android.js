import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import { Layout } from "./router";
import { Helper } from './app/components/Helper.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading:true,
            destination:null,
            screen:'Home'
        }

      }

    _transition(cover){
        this.setState({
            loading:cover
        })
    }

    _onClick(val){
        this.setState({
            destination:val
        })
    }

    _receiveNav(navigation){
        this.navigation = navigation
    }

    _changeScreen(screen){
        this.setState({
            screen:screen
        })
    }

    render(){
        return <View style = {{flex:1}}>
            <Layout 
                screenProps={{
                    showCover:val=>{this._transition(val)},
                    passNavigation:val=>{this._receiveNav(val)},
                    changeScreen:val=>{this._changeScreen(val)}
                }}
            />
            <Helper 
                loading = {this.state.loading}
                onClick = {val => {this._onClick(val)}}
                navigation = {this.navigation}
                screen = {this.state.screen}
            />
        </View>;
    }
}

AppRegistry.registerComponent('Huddle', () => App);