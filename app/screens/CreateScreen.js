
import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    Image,
    Platform,
    StatusBar
}   from 'react-native';

import { StackNavigator } from 'react-navigation';

const headerStyle = {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  };

class FirstScreen extends Component {
    render(){
        return <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{fontSize: 30, color: 'red'}}>
                        First Screen Stack
                    </Text>
                    <Button
                        backgroundColor="#03A9F4"
                        title="Go to Second Stack"
                        onPress={() => this.props.navigation.navigate('SecondScreen')} 
                    />
                </View>
            }
}

class SecondScreen extends Component {
    render(){
        return <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{fontSize: 30, color: 'red'}}>
                        Second Screen Stack
                    </Text>
                    <Button
                        backgroundColor="#03A9F4"
                        title="Go Back a Stack"
                        onPress={() => this.props.navigation.navigate('FirstScreen')} 
                    />
                </View>
            }
}


export default stackNav = StackNavigator(
{
    FirstScreen: {
        screen: FirstScreen,
 
    },
    SecondScreen: {
        screen: SecondScreen,
    },
},

    {
        headerMode: 'none',
    }

);