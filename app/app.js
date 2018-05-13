import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';

import Overlord from './menu/Overlord';
import { Helper } from './navigation/Helper.js';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return <Provider store = {store}>
            <Overlord>
                <Helper/>
            </Overlord>
        </Provider>
    }
}

export default App