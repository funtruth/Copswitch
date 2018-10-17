import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react'

import AppNavigator from "../modules/navigation/AppNavigator";
import AndroidHandler from '../components/AndroidHandler';
import NavigationTool from '../modules/navigation/NavigationTool'
import DevTool from '../components/dev/DevTool';

class App extends Component {
    render(){
        return (
            <Provider store = {store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AppNavigator
                        ref = {navigatorRef => {
                            NavigationTool.setContainer(navigatorRef)
                        }}
                    />
                    <AndroidHandler/>
                    <DevTool/>
                </PersistGate>
            </Provider>
        )
    }
}

export default App