import React, { Component } from 'react';
import { View, Text, Animated, BackHandler } from 'react-native';

import colors from '../misc/colors.js';
import { NavigationActions } from 'react-navigation';

import Router from "./router";
import NavigationTool from './NavigationTool.js';

export class Helper extends React.Component {
        
    constructor(props) {
        super(props);

        this.state = {
            nav: new Animated.Value(0),
        }
    }

    componentDidMount(){
        BackHandler.addEventListener("hardwareBackPress", this._onBackPress.bind(this));
    }

    componentWillUnmount(){
        BackHandler.removeEventListener("hardwareBackPress");
    }

    _onBackPress(){
        return true
    }

    _showCover(show){
        Animated.timing(
            this.state.nav,{
                toValue:show?1:0,
                duration:400
            }
        ).start()
    }

    _navigate(screen){

        Animated.sequence([
            Animated.timing(
                this.state.nav,{
                    toValue:1,
                    duration:400
                }
            ),
            Animated.timing(
                this.state.nav,{
                    toValue:0,
                    duration:800
                }
            )
        ]).start()

        setTimeout(()=>{
            this.navigation.dispatch(
                NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ 
                            routeName: screen,
                        })
                    ]
                    })
                )
        },400)

    }

    render() {

        return (
            <View style = {styles.container}>

                <Animated.View style = {{
                    flex:1,
                    opacity: this.state.nav.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0],
                    }),
                    transform: [{
                        scale: this.state.nav.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1],
                        })
                    }],
                }}>
                    <Router
                        ref = {navigatorRef => {
                            NavigationTool.setContainer(navigatorRef)
                        }}
                    />
                </Animated.View>

            </View>
        )
    }
}

const styles = {
    container : {
        position:'absolute',
        left:0,
        right:0,
        bottom:0,
        top:0,
        backgroundColor:'#5f5d58'
    }
}