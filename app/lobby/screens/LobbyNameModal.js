
import React, { Component } from 'react';
import {
    TextInput,
    View,
    TouchableOpacity,
    Dimensions,
    Animated
}   from 'react-native';
import { connect } from 'react-redux'

import { Header } from '../../components/index.js';
import LobbyTextInput from '../components/LobbyTextInput.js';
const { height, width } = Dimensions.get('window')

class LobbyNameModal extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            username: props.username,
            modalValue: new Animated.Value(0)
        }
    }

    componentDidMount() {
        let { username } = this.props
        if (!username) {
            this._showModal(true)
        } else {
            this.refs.textInput.ref.setState({
                name: username
            })
        }
    }

    componentWillReceiveProps(newProps) {
        let { username } = newProps
        if (username && username !== this.props.username){
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
                <Header icon='remove' onPress={this._onBackPress}>CHOOSE AN ALIAS</Header>
                <LobbyTextInput/>
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
        color:colors.font,
        textAlign:'center',
        justifyContent:'center',
    },
}

export default connect(
    state => ({
        username: state.lobby.username
    })
)(LobbyNameModal)