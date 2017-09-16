
import React, { Component } from 'react';
import {
    ListItem
} from 'react-native-elements';


import firebase from '../firebase/FirebaseController.js';

export default class ProfileButton extends React.Component {

constructor(props) {
    super(props);
}
      

render() {
    return (
        <ListItem
            title={this.props.title}
            titleStyle={{
                fontWeight: 'normal',
                fontSize: 14,
                color: '#b18d77',
            }}
            subtitle={this.props.subtitle}
            subtitleStyle={{
                marginLeft: 25,
                fontWeight: 'bold',
                fontSize: 17,
                color: "#b18d77",
            }}
            backgroundColor='#decfc6'
            hideChevron={true}
            switchButton={true}
            switchTintColor='#e6ddd1'
            switchOnTintColor='#b18d77'
            switchThumbTintColor='#c9b0a1'
            switched={this.props.switched}
            onSwitch={this.props.onSwitch}
            onPress={this.props.onPress}
      />
    )
}
}