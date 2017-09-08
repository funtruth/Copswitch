
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

class JoinScreen extends React.Component {

constructor(props) {
    super(props);
    this.backButtonListener = null;
    this.currentRouteName = 'Join';
    }

componentWillMount() {
    this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', () => {
        if (this.currentRouteName !== 'Join') {
            return false;
        }
    this.props.navigation.navigate('Join');
    return true;
    });

}

componentWillUnmount() {
    this.backButtonListener.remove();
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