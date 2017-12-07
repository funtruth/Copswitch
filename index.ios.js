import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { createRootNavigator } from "./router";

export default class App extends React.Component {
    constructor(props) {
        super(props);
      }
    

    render(){
        const Layout = createRootNavigator(true, true);
        return <Layout />;
    }
}

AppRegistry.registerComponent('Huddle', () => App);