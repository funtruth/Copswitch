
import React from 'react';
import {
    Text,
    View,
    Button,
    Image,
    BackHandler,
    ScrollView,
    ListView,
    FlatList
}   from 'react-native';
import {
    Card,
    FormInput,
    List,
    ListItem
}   from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import firebase from '../firebase/FirebaseController.js';

class JoinScreen extends React.Component {

constructor(props) {
    super(props);
    this.currentRouteName = 'Join';

    const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
        datac: dataSource
    };
}

_makeRoomRequest = () => {
    
    this.setState({ loading: true });

    firebase.database().ref('rooms/').on('value', (dataSnapshot) => {
        var tasks = [];
        dataSnapshot.forEach((child) => {
        tasks.push({
            "coffeeshop": child.val().coffeeshop,
            "dropoffloc": child.val().dropoffloc,
            "dropofftime": child.val().dropofftime,
            "roomname": child.val().roomname,
            "roomsize": child.val().roomsize,
            "spot1": child.val().spot1,
            "spot2": child.val().spot2,
            "spot3": child.val().spot3,
            "spotsleft": child.val().spotsleft,
            "_key": child.key
        });
    });
        
        this.setState({
        //data: this.state.data.cloneWithRows(tasks)
            datac: tasks
        });
    });
};

componentWillMount() {
    this._makeRoomRequest();
}


render(){
    return <View>
            <Card style={{
                width: 350,
                height: 400    
            }}>
            <List style={{ borderTopWidth:0, borderBottomWidth:0 }}>
                <FlatList
                    data={this.state.datac}
                    renderItem={({item}) => (
                        <ListItem 
                            title={`${item.roomname} ${item.coffeeshop}`}
                            subtitle={item.spotsleft}
                        />
                    )}
                    keyExtractor={item => item._key}
                />  
            </List>
            </Card>
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