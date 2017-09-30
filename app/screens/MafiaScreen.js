
import React from 'react';
import {
    View,
    Image,
    AsyncStorage,
    BackHandler,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    Keyboard,
    FlatList,
    ListView,
    TouchableOpacity
}   from 'react-native';

import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import ModalPicker from 'react-native-modal-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import randomize from 'randomatic';

import { Button, List, ListItem, FormInput } from "react-native-elements";
import ProfileButton from '../components/ProfileButton.js';
import HeaderButton from '../components/HeaderButton.js';
import NormalListItem from '../components/NormalListItem.js';
import ToggleListItem from '../components/ToggleListItem.js';

//Firebase
import firebase from '../firebase/FirebaseController.js';

class Day_Screen extends React.Component {

constructor(props) {
    super(props);

    this.state = {
        joincode: '',
    };

}

componentWillMount() {
    const { params } = this.props.navigation.state;
    const roomname = params.roomname
    
}

componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);
}

_handleBackButton() {
    return true;
}

_makeRoom() {
    
}

render() {
    return <View style = {{
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
    }}>
        <View style = {{flex:1}}>

        </View>

        <View style = {{flex:2}}>
            <View style = {{
                flex:1,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                backgroundColor: 'black',
                justifyContent: 'center',
            }}> 
                <Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
                    Day Phase
                </Text>
            </View>

            <View style = {{flex:8}}/>
        </View>

        <View style = {{flex:1}}>

        </View>

    </View>
}
}
    
class Nomination_Screen extends React.Component {

constructor(props) {
    super(props);

    this.state = {
        joincode: '',
    };

}

componentWillMount() {

    
}

componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);
}

_handleBackButton() {
    return true;
}

_makeRoom() {
    
}

render() {
    return <View style = {{
        backgroundColor: 'white',
        flex: 1,
    }}>

        <View style = {{
            flex:1,
            margin: 10,
            borderRadius: 10,
            backgroundColor: 'black',
            justifyContent: 'center',
        }}>
            <Text style = {{color:'white', marginLeft:20, fontWeight: 'bold',}}>
                Active Game
            </Text>
        </View>

        <View style = {{flex:1.5}}/>

        <View style = {{
            flex:1.5,
            margin: 5,
            borderWidth: 1,
            justifyContent: 'center',
            flexDirection: 'row',
        }}>
                <View style = {{flex:1}}/>
                <View style = {{flex:4}}>
                <ProfileButton
                    title="Create Room"
                    onPress={()=>{alert('hi')}}
                /></View>
                <View style = {{flex:1}}/>

        </View>
        
        <View style = {{flex:1}}/>

        <View style = {{
            flex:1,
            margin: 5,
            borderWidth: 1,
            justifyContent: 'center',
            flexDirection: 'row',
        }}>
            <View style = {{flex:1}}/>
            <TextInput
                placeholder="Room Code ..."
                style={{
                    backgroundColor: 'white',
                    borderWidth:2,
                    flex:2,
                }}
                value={this.state.joincode}
                onChangeText = {(text) => {this.setState({joincode: text})}}
            />
            <View style = {{flex:1}}/>
        </View>

        <View style = {{
            flex:1.5,
            margin: 5,
            borderWidth: 1,
            justifyContent: 'center',
            flexDirection: 'row',
        }}>
        
            <View style = {{flex:1}}/>
            <View style = {{flex:4}}>
            <ProfileButton
                title="Join Room"
                onPress={()=>{alert('hi')}}
            /></View>
            <View style = {{flex:1}}/>

        </View>

        <View style = {{flex:3}}/>


    </View>
}
}

class Night_Screen extends React.Component {

constructor(props) {
    super(props);

    this.state = {
        joincode: '',
    };

}

componentWillMount() {

    
}

componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);
}

_handleBackButton() {
    return true;
}

_makeRoom() {
    
}

render() {
    return <View style = {{
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
    }}>
        <View style = {{flex:1}}>

        </View>

        <View style = {{flex:2}}>
            <View style = {{
                flex:1,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                backgroundColor: 'black',
                justifyContent: 'center',
            }}> 
                <Text style = {{color:'white', alignSelf:'center', fontWeight: 'bold',}}>
                    Day Phase
                </Text>
            </View>

            <View style = {{flex:8}}/>
        </View>

        <View style = {{flex:1}}>

        </View>

    </View>
}}

export default stackNav = StackNavigator(
  {
      Day_Screen: {
        screen: Day_Screen,
      },
      Nomination_Screen: {
        screen: Nomination_Screen,
      },
      Night_Screen: {
        screen: Night_Screen,
      },
  },
      {
          headerMode: 'none',
          initialRouteName: 'Day_Screen',
      }
  );


  const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: '#a98fe0',
    },
    actionButtonItem: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },

});