/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


import React, { Component } from 'react';

import Signup from './app/pages/signup.js';
import DrawerExample from './app/App.js';
import { AppRegistry } from 'react-native';

//import { SignedOut } from './router.js'

//New FB
import { createRootNavigator } from "./router";
import { isSignedIn } from "./app/auth";

export default class App extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          signedIn: false,
          checkedSignIn: false
        };
      }
    

    componentWillMount() {
    isSignedIn()
        .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
        .catch(err => alert("An error occurred"));
    }


    render(){
        const { checkedSignIn, signedIn } = this.state;
        
        // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
        if (!checkedSignIn) {
            return null;
        }
    
        const Layout = createRootNavigator(signedIn);
        return <Layout />;
    }
}

//AppRegistry.registerComponent('Huddle', () => Signup);
AppRegistry.registerComponent('Huddle', () => App);
//AppRegistry.registerComponent('Huddle', () => DrawerExample);
//AppRegistry.registerComponent('Huddle', () => SignedOut);