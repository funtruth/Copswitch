import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import { createRootNavigator } from "./router";
import { Helper } from './app/components/Helper.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading:true
        }
      }
    
    _transition(cover){
        this.setState({
            loading:cover
        })
    }

    render(){
        const Layout = createRootNavigator(this._transition);
        return <View style = {{flex:1}}>
            <Layout />
            <Helper 
                loading = {this.state.loading}
            />
        </View>;
    }
}

AppRegistry.registerComponent('Huddle', () => App);