
import React, { Component } from 'react';
import {
    Text,
    FlatList,
}   from 'react-native';

import { Slide } from '../parents/Slide.js';

import colors from '../misc/colors.js';

class ActivityLogComponent extends Component {

    constructor(props) {
        super(props);
    }

    _renderItem(item){
        return <Slide>
            <Text style = {styles.playerList}>{item.message}</Text>
        </Slide>
    }

    render() {

        return <FlatList
            data={this.props.data}
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

export default ActivityLogComponent