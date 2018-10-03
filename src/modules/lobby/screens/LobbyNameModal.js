
import React, { Component } from 'react';
import {
    View,
    Dimensions,
    Animated
}   from 'react-native';

import { Header } from '@components/index.js';
import LobbyTextInput from '../components/LobbyTextInput';
const { height, width } = Dimensions.get('window')

class LobbyNameModal extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            modalValue: new Animated.Value(1)
        }
    }

    componentWillReceiveProps(newProps) {
        let { name } = newProps
        if (name && name !== this.props.name){
            this._showModal(false)
        }
    }

    _showModal = (show) => {
        if (show) {
            //focus()
        }
        Animated.timing(
            this.state.modalValue,{
                toValue: show?1:0,
                duration: 400,
                useNativeDriver: true
            }
        ).start()
    }

    _onBackPress = () => {
        this._showModal(false)
    }

    render() {
        const { modal } = styles

        return (
            <Animated.View style={[modal,{
                opacity: this.state.modalValue.interpolate({
                    inputRange: [0,1], outputRange: [0,1]
                }),
                transform: [{
                    translateY: this.state.modalValue.interpolate({
                        inputRange: [0,1], outputRange: [height,0]
                    })
                }]
            }]}>
                <View style={{flex:0.2}}/>
                <Header icon='angle-left' onPress={this._onBackPress}>CHOOSE AN ALIAS</Header>
                <LobbyTextInput
                    name={this.props.name}
                    lobby={this.props.lobby}
                />
            </Animated.View>
        )
    }
}

const styles = {
    modal: {
        position: 'absolute',
        top: 0, height,
        left: 0, width,
        backgroundColor: 'rgba(46,38,32,0.8)'
    },
    nameInput: {
        fontFamily:'FredokaOne-Regular',
        fontSize: 18,
        textAlign:'center',
        justifyContent:'center',
    },
}

export default LobbyNameModal