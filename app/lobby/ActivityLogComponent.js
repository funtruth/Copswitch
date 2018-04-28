
import React, { Component } from 'react';
import {
    Text,
    FlatList,
}   from 'react-native';

import { Slide } from '../parents/Slide.js';

import colors from '../misc/colors.js';

import firebaseService from '../firebase/firebaseService';

class ActivityLogComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activityLog: []
        }

        this.infoRef = null
    }

    componentWillMount() {

        //import all listeners
        const { logRef } = firebaseService.fetchLobbyListeners()

        this.infoRef = logRef

        this.infoRef.on('child_added',snap=>{
            if(snap.exists()){
                this.setState(prevState => ({
                    activityLog: [{
                        message: snap.val(),
                        key: snap.key
                    }, ...prevState.activityLog]
                }))
            }
        })

    }

    componentWillUnmount() {
        if(this.infoRef) this.infoRef.off()
    }

    _renderItem(item){
        return <Slide>
            <Text style = {styles.playerList}>{item.message}</Text>
        </Slide>
    }

    render() {

        return <FlatList
            data={this.state.activityLog}
            renderItem={({item}) => this._renderItem(item)}
            initialNumToRender={15}
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

export default ActivityLogComponent