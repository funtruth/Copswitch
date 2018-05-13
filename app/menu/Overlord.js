import React, { Component } from 'react';
import Menu from './ListNavigator';

class Overlord extends Component {

    render() {
        return <Menu>
            {this.props.children}
        </Menu>
    }

}

export default Overlord