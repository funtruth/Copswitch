
import React, { Component } from 'react';
import {
    ListItem
} from 'react-native-elements';

export default class RulebookListItem extends React.Component {

constructor(props) {
    super(props);
}
      

render() {

    return (
        <ListItem
            title={this.props.title}
            titleStyle={{
                fontSize: 17,
                fontWeight: 'bold',
                color: this.props.color,
            }}
            subtitle= {this.props.subtitle}
            subtitleStyle={{
                fontSize: 13,
                color: "black",
            }}
            backgroundColor='white'
            containerStyle={{
                borderBottomWidth: 0,
            }}
            hideChevron={true}

      />
    )
}
}