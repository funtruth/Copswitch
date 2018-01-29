import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity, BackHandler, Keyboard } from 'react-native';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from 'react-navigation';

import { Layout } from "../../router";
import { Alert } from './Alert.js';

import { HelperButton } from './HelperButton.js';
import List from '../screens/ListsScreen.js';
import Screens from '../misc/screens.json';

const AnimatableIcon = Animatable.createAnimatableComponent(FontAwesome)
const FAST_ANIM = 100;
const MED_ANIM = 400;

export class Helper extends React.Component {
    
constructor(props) {
    super(props);

    this.screen = 'Loading'
    this.radiusScale = new Animated.Value(5)
    
    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
    
    this.icon = this.height/9;
    this.menuSideMargins = new Animated.Value(this.width/2 - 10);
    this.menuTopMargin = new Animated.Value(this.height/2 - 10);
    this.menuBottomMargin = new Animated.Value(this.height/2 - 10);

    this.state = {

        disabled:true,
        showMenu:false,
        alertVisible:false,

        helperY: new Animated.Value(this.height*4/9),
        shadowY: new Animated.Value(this.height*5/18),

        menuOpacity: new Animated.Value(0),
    }
}

componentDidMount(){
    BackHandler.addEventListener("hardwareBackPress", this._onBackPress.bind(this));
}

componentWillUnmount(){
    BackHandler.removeEventListener("hardwareBackPress");
}

_onBackPress(){
    if(this.state.showMenu){
        this._menuPress(false)
    }
    else if(this.state.alertVisible){
        this._viewAlert(false)
    }
    else if(Screens[this.screen].alert){
        this._viewAlert(true)
    }
    return true
}

//Prop Functions
_receiveNav(navigation){
    this.navigation = navigation
}

_navigate(screen){
    this.setState({
        disabled:true
    })
    setTimeout(()=>{
        this.setState({
            disabled:false
        })
    },2500)

    console.log('Starting Animation')
    Animated.parallel([
        Animated.timing(
            this.radiusScale,{
                toValue:5,
                duration:400
            }
        ),
        Animated.timing(
            this.state.helperY,{
                toValue:Screens[screen].yFactor*this.height,
                duration:400
            }
        ),
        Animated.timing(
            this.state.shadowY,{
                toValue:Screens[screen].yFactor*this.height - this.height/6,
                duration:400
            }
        )
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

        this.screen = screen
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

_navigateP(screen,roomname){
    this.setState({
        disabled:true
    })
    setTimeout(()=>{
        this.setState({
            disabled:false
        })
    },2500)

    console.log('Starting Animation')
    Animated.parallel([
        Animated.timing(
            this.radiusScale,{
                toValue:5,
                duration:400
            }
        ),
        Animated.timing(
            this.state.helperY,{
                toValue:Screens[screen].yFactor*this.height,
                duration:400
            }
        ),
        Animated.timing(
            this.state.shadowY,{
                toValue:Screens[screen].yFactor*this.height - this.height/6,
                duration:400
            }
        )
    ]).start()

    setTimeout(()=>{

        if(screen == 'MafiaRoom'){
            this.navigation.dispatch(
              NavigationActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ 
                        routeName: 'MafiaRoom',
                        params: { roomname:roomname }
                    })
                  ]
                })
            )
        } else {
            this.navigation.navigate(screen,{ roomname:roomname })
        }

        this.screen = screen
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

//Needs rework
_quit(){
    this._menuPress(false)
    setTimeout(()=>{
        this._viewAlert(true)
    },200)
        
}

_alertOkay(){
    this.setState({
        alertVisible:false
    })
    if(this.screen == 'Home'){
        BackHandler.exitApp()
    } else {
        this._navigate('Home')        
    }
}
_viewAlert(bool){

    if(bool){
        Keyboard.dismiss()
    }

    const helperHeight = 0.54

    this.setState({
        alertVisible:bool
    })

    Animated.parallel([
        Animated.timing(
            this.state.helperY,{
                toValue:bool?helperHeight*this.height:Screens[this.screen].yFactor*this.height,
                duration:400
            }
        ),
        Animated.timing(
            this.state.shadowY,{
                toValue:bool?helperHeight*this.height-this.height/6:Screens[this.screen].yFactor*this.height-this.height/6,
                duration:400
            }
        )
    ]).start()
        
}

_menuPress(show) {

    if(show){
        Keyboard.dismiss()
    }

    if(!this.state.alertVisible){
        this.setState({
            showMenu:show
        })

        Animated.parallel([
            Animated.timing(
                this.menuSideMargins,{
                    toValue:show?15:this.width/2 - 10,
                    duration:200
                }
            ),
            Animated.timing(
                this.menuTopMargin,{
                    toValue:show?30:this.height/2 - 10,
                    duration:200
                }
            ),
            Animated.timing(
                this.menuBottomMargin,{
                    toValue:show?15:this.height/2 - 10,
                    duration:200
                }
            ),
            Animated.timing(
                this.state.menuOpacity,{
                    toValue:show?1:0,
                    duration:20
                }
            ),
            Animated.timing(
                this.state.helperY,{
                    toValue:this.height*(show?0.84:Screens[this.screen].yFactor),
                    duration:200
                }
            )
        ]).start()
    }
}

render() {

    return ( 
        <View style = {{position:'absolute', left:0, right:0, bottom:0, top:0,
            justifyContent:'center', alignItems:'center', backgroundColor:'transparent'}}>

                <View style = {{position:'absolute', left:0, right:0, bottom:0, top:0,}}>
                    <Layout
                        screenProps={{
                            passNavigation:val=>{this._receiveNav(val)},
                            navigate:val=>{
                                this._navigate(val)
                            },
                            navigateP:(val,roomname)=>{
                                this._navigateP(val,roomname)
                            }
                        }}
                    />
                </View>
            
                <TouchableOpacity
                    style = {{position:'absolute', top:this.height*0.05, right:this.height*0.05}}
                    onPress = {()=>{this._viewAlert(true)}}>
                    <MaterialCommunityIcons name='close-circle' style={{color:colors.shadow,fontSize:30}}/>
                </TouchableOpacity>

                <Animated.View style = {{position:'absolute', elevation:0, bottom:this.state.shadowY,
                    height:this.icon*4, width:this.icon*4, borderRadius:this.icon*2, backgroundColor: colors.immune,
                    justifyContent:'center', alignItems:'center',
                    transform: [
                        {scale:this.radiusScale}
                    ],
                }}/>

                <Animated.View style = {{position:'absolute', elevation:0, 
                    left:this.menuSideMargins, right:this.menuSideMargins, 
                    top:this.menuTopMargin, bottom:this.menuBottomMargin,
                    borderRadius:30, backgroundColor:colors.immune}}>

                    <View style = {{flex:0.07}}/>
                    <Animated.View style = {{flex:0.86, backgroundColor:colors.font, opacity:this.state.menuOpacity}}>
                        <List 
                            screenProps = {{
                                quit: ()=>{this._quit()}
                            }}
                        />
                    </Animated.View>
                    <View style = {{flex:0.07}}/>

                </Animated.View>

                <Alert
                    subtitle = {'Are you sure you' + '\n' + 'want to leave?'}
                    okay = 'OK'
                    cancel = 'Cancel'
                    visible = {this.state.alertVisible}
                    onClose = {() => this._viewAlert(false)}
                    onOkay = {() => this._alertOkay()}
                    onCancel = {() => this._viewAlert(false)}
                />

                <Animated.View style = {{position:'absolute', elevation:5, bottom:this.state.helperY,
                    height:this.icon, width:this.icon, borderRadius:this.icon/2, backgroundColor: colors.helper,
                    justifyContent:'center', alignItems:'center',
                }}>
                    <TouchableOpacity
                        style = {{flex:1, justifyContent:'center',alignItems:'center'}}
                        onPress = {()=>{ this._menuPress(!this.state.showMenu) }}
                        disabled = {this.state.disabled}
                    >
                        <FontAwesome name='user-secret' style={{ color:colors.background, fontSize: this.icon/1.8 }}/>
                    </TouchableOpacity>
                </Animated.View>
        </View>
    )
}
}
