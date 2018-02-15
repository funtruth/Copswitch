import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity, BackHandler, Keyboard } from 'react-native';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import { NavigationActions } from 'react-navigation';

import { Layout } from "../../router";

import Screens from '../misc/screens.json';

const FAST_ANIM = 100;
const MED_ANIM = 400;

export class Helper extends React.Component {
        
    constructor(props) {
        super(props);

        this.radiusScale = new Animated.Value(5)
        
        this.width = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;
        
        this.icon = this.height/9;

        this.state = {
            helperY: this.width*5/6,
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

    //Prop Functions
    _receiveNav(navigation){
        this.navigation = navigation
    }

    _showCover(show){
        Animated.timing(
            this.radiusScale,{
                toValue:show?5:0.25,
                duration:400
            }
        ).start()
    }

    _navigate(screen,param){

        console.log('Starting Animation')
        Animated.parallel([
            Animated.timing(
                this.radiusScale,{
                    toValue:5,
                    duration:400
                }
            ),
        ]).start()
            

        setTimeout(()=>{
            if(screen == 'Home'){
                this.navigation.dispatch(
                    NavigationActions.reset({
                        index: 0,
                        actions: [
                        NavigationActions.navigate({ routeName: 'Home'})
                        ]
                    })
                )
            } else {
                this.navigation.navigate(screen)
            }

            console.log("Navigating Screens");
        },400)

        setTimeout(()=>{
            Animated.timing(
                this.radiusScale,{
                    toValue:0.25,
                    duration:500
                }
            ).start()
            console.log('Uncovering Screen')
        },1500) 
    }

    _navigateP(screen,param){

        Animated.parallel([
            Animated.timing(
                this.radiusScale,{
                    toValue:5,
                    duration:400
                }
            ),
        ]).start()

        setTimeout(()=>{

            if(screen == 'Mafia'){
                this.navigation.dispatch(
                NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ 
                            routeName: 'Mafia',
                            params: { roomname:param }
                        })
                    ]
                    })
                )
            } else {
                this.navigation.navigate(screen,{ roomname:param })
            }

        },400)

        setTimeout(()=>{
            Animated.timing(
                this.radiusScale,{
                    toValue:0.25,
                    duration:500
                }
            ).start()
        },1500) 
    }

    render() {

        return (
            <View style = {{position:'absolute', left:0, right:0, bottom:0, top:0,
                justifyContent:'center', alignItems:'center', backgroundColor:colors.background}}>

                <View style = {{position:'absolute', left:0, right:0, bottom:0, top:0}}>
                    <Layout
                        screenProps={{
                            passNavigation:val=>{this._receiveNav(val)},
                            navigate:val=>{
                                this._navigate(val)
                            },
                            navigateP:(val,roomname)=>{
                                this._navigateP(val,roomname)
                            },
                            cover:val=>{this._showCover(val)},
                        }}
                    />
                </View>

                <Animated.View style = {{position:'absolute', elevation:0, left:this.state.helperY,
                    height:this.icon*4, width:this.icon*4, borderRadius:this.icon*2, backgroundColor: colors.helper,
                    justifyContent:'center', alignItems:'center',
                    transform: [
                        {scale:this.radiusScale}
                    ],
                }}/>

            </View>
        )
    }
}
