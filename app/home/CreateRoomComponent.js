import React, { Component } from 'react';
import {
    View,
    Text,
    AsyncStorage,
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

    render() {

        return <View>

            <Text style = {styles.title}>CREATE</Text>

            <Button
                horizontal={0.35}
                color = {colors.dead}
                backgroundColor = {colors.box}
                onPress={()=> this._createRoom() }
            >
                <Text style = {styles.buttonText}>Go!</Text>
            </Button>

        </View>
    }
}

const styles = {
    title: {
        fontSize: 30,
        fontFamily: 'FredokaOne-Regular',
        textAlign:'center',
        color: colors.striker,
        marginBottom: 10
    },
    buttonText: {
        fontSize: 19,
        fontFamily: 'FredokaOne-Regular',
        color: colors.font,
        margin:4
    },

}

export default CreateRoomComponent
