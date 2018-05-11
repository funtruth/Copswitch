import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store';

import { Helper } from '../navigation/Helper.js';

class App extends Component {
    constructor(props) {
        super(props);
      }

    render(){
        return <Provider store = {store}>
            <Helper/>
        </Provider>
    }
}

export default App