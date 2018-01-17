import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { createRootNavigator } from "./router";

export default class App extends React.Component {
    constructor(props) {
        super(props);
      }
    
    _transition(){
        alert('hi')
    }

    render(){
        const Layout = createRootNavigator(this.props,this._transition);
        return <Layout />;
    }
}

AppRegistry.registerComponent('Huddle', () => App);