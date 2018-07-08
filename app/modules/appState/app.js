import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { store } from '@services';

import { Helper } from '@navigation';

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