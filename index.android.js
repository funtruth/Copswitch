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

    render(){
        return <View style = {{flex:1}}>
            <Layout 
                screenProps={{
                    showCover:val=>{this._transition(val)},
                    destination:this.state.destination
                }}
            />
            <Helper 
                loading = {this.state.loading}
                onClick = {val => {this._onClick(val)}}
            />
        </View>;
    }
}

AppRegistry.registerComponent('Huddle', () => App);