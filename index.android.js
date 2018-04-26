import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Helper } from './app/navigation/Helper.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);
      }

    render(){
        return <Helper/>
    }
}

AppRegistry.registerComponent('Huddle', () => App);