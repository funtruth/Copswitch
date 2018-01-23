import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import { Helper } from './app/components/Helper.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);
      }

    render(){
        return <Helper/>
    }
}

AppRegistry.registerComponent('Huddle', () => App);