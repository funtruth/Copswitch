
import React, { Component } from 'react';
import {
    Text,
    View,
    FlatList,
    Dimensions,
}   from 'react-native';

import { Slide } from '../parents/Slide.js';

import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';

class PlayerListComponent extends Component {

    constructor(props) {
        super(props);

        this.width = Dimensions.get('window').width,
        this.height = Dimensions.get('window').height

        this.state = {
            list:[]
        }
    }

    componentWillReceiveProps(newProps){
        this.setState({
            list:newProps.list
        })
    }

    _renderItem(item){
        return <Slide><Text style = {styles.playerList}>{item.name + item.message}</Text></Slide>
    }

    render() {

        return <FlatList
            data={this.state.list}
            renderItem={({item}) => this._renderItem(item)}
            keyExtractor={item => item.key}
        />
    }
}

const styles = {
    playerList: {
        fontSize: 16,
        fontFamily: 'FredokaOne-Regular',
        color: colors.font,
        alignSelf:'center',
        margin:5,
        opacity:0.7,
    },
}

export default PlayerListComponent