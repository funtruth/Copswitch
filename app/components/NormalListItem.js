
import React, { Component } from 'react';
import {
    ListItem
} from 'react-native-elements';
import {
    TextInput
} from 'react-native'
;

import firebase from '../firebase/FirebaseController.js';

export default class NormalListItem extends React.Component {

constructor(props) {
    super(props);
}
      

render() {

    return (
        <ListItem
            title={this.props.title}
            titleStyle={{
                fontWeight: 'normal',
                fontSize: 16,
                color: '#b18d77',
            }}
            subtitle= {this.props.subtitle}
            subtitleStyle={{
                marginLeft: 25,
                fontWeight: 'bold',
                fontSize: 17,
                color: "#b18d77",
            }}
            backgroundColor='#e6ddd1'
            containerStyle={{
                borderBottomWidth: 0,
            }}
            onPress={this.props.onPress}
      />
    )
}
}