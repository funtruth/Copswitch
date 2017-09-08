
import React from 'react';
import {
    Text,
    View,
    Button,
    Image,
    BackHandler,
    ScrollView
}   from 'react-native';
import {
    Card,
    FormInput
}   from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

class JoinScreen extends React.Component {

constructor(props) {
    super(props);
    this.currentRouteName = 'Join';
    }

componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => this._backAndroid())
}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => this._backAndroid())
}

_backAndroid(){
    return true
}

    render(){
        return <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
                }}>
                <ScrollView>
                <Card title='Room 1'>
 
                    <FormInput
                        value="Room 1"
                    />
                    
                    <FormInput
                        value="Room 1"
                    />

                    <FormInput
                        value="Room 1"
                    />

                    <FormInput
                        value="Room 1"
                    />
                </Card>

                <Card title='Room 2'>
                
                    <FormInput
                        value="Room 2"
                    />
                    
                    <FormInput
                        value="Room 1"
                    />

                    <FormInput
                        value="Room 1"
                    />

                    <FormInput
                        value="Room 1"
                    />
                </Card>

                <Card title='Room 3'>
                
                    <FormInput
                        value="Room 3"
                    />
                    
                    <FormInput
                        value="Room 1"
                    />

                    <FormInput
                        value="Room 1"
                    />

                    <FormInput
                        value="Room 1"
                    />
                </Card>
                </ScrollView>
            </View>
    }};

export default JoinNavigation = StackNavigator(
{
    JoinScreen: {
        screen: JoinScreen,
    },
},
    {
        headerMode: 'none',
    }
)