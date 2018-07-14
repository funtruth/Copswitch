import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react'

import AppContainer from './AppContainer';

class App extends Component {
    render(){
        return (
            <Provider store = {store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AppContainer />
                </PersistGate>
            </Provider>
        )
    }
}

export default App