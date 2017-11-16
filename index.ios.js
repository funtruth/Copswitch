import React, { Component } from 'react';

import { AppRegistry } from 'react-native';

import { createRootNavigator } from "./router";
import { isSignedIn, isInGame } from "./app/auth";

export default class App extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          signedIn: false,
          checkedSignIn: false,

          inGame: false,
          checkedInGame: false,
        };
      }
    
    componentWillMount() {

        isSignedIn()
            .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
            .catch(err => alert("An error occurred"));

        isInGame()
            .then(res => this.setState({ inGame: res, checkedInGame: true }))
            .catch(err => alert("An error occurred"));
        
    }

    render(){
        const { checkedSignIn, signedIn,
                checkedInGame, inGame } = this.state;
        
        // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
        if (!checkedSignIn || !checkedInGame) {
            return null;
        }
    
        const Layout = createRootNavigator(signedIn, inGame);
        return <Layout />;
    }
}

AppRegistry.registerComponent('Huddle', () => App);