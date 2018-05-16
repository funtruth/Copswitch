import React, { Component } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Animated
}   from 'react-native';

import { Button } from '../components/Button.js';

import colors from '../misc/colors.js';

import firebaseService from '../firebase/firebaseService.js';

class CreateRoomComponent extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            loading:false
        }
        this.nav = new Animated.Value(0)
    }

    async _createRoom() {
        
        this.setState({
            loading:true
        })

        const roomId = await firebaseService.createRoom()
        
        this.props.screenProps.navigate('Lobby',roomId)

        this.setState({
            loading:false
        })

    }

    componentWillReceiveProps(newProps){
        if ( newProps.section !== this.props.section ) {
            this._show( newProps.section === 'create' )
        }
    }

    _show(view){
        Animated.timing(
            this.nav,{
                toValue: view?1:0,
                duration: 600
            }
        ).start()
    }

    render() {
        return(
            <Animated.View style = {{
                opacity: this.nav.interpolate({
                    inputRange:[0, 0.5, 1],
                    outputRange:[0, 0, 1]
                }),
                height: this.nav.interpolate({
                    inputRange:[0,0.5,1],
                    outputRange:[0, 50, 50]
                })
            }}>
                <ActivityIndicator 
                    size = "large"
                    color = { colors.shadow }
                    style = { styles.indicator }
                />
            </Animated.View>
        )
    }
}

const styles = {
    indicator:{
        margin: 10
    }
}

export default CreateRoomComponent
