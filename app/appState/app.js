import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import store from '../redux/store';

import { Helper } from '../navigation/Helper.js';
import Overlord from '../menu/Overlord';

class App extends Component {
    render(){
        return (
            <Provider store = {store}>
                <Helper />
            </Provider>
        )
    }
}

export default App