import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '@services';
import { PersistGate } from 'redux-persist/integration/react'

import Router from './Router';

class App extends Component {
    render(){
        return (
            <Provider store = {store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Router />
                </PersistGate>
            </Provider>
        )
    }
}

export default App