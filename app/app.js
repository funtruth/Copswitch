import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import store from './redux/store';

import { Helper } from './navigation/Helper.js';
import Overlord from './menu/Overlord';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return <Provider store = {store}>
            <View style = {{flex:1}}>
                <Helper />
                <Overlord />
            </View>
        </Provider>
    }
}

export default App