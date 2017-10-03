
import React, { Component } from 'react';
import {
    ListItem
} from 'react-native-elements';
import {
    Text,
    View
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import firebase from '../firebase/FirebaseController.js';

export default class RulebookListItem extends React.Component {

constructor(props) {
    super(props);
}
      

render() {

    return (
        <ListItem
            title={this.props.title}
            titleStyle={{
                fontSize: 17,
                fontWeight: 'bold',
                color: this.props.color,
            }}
            subtitle= {this.props.subtitle}
            subtitleStyle={{
                fontSize: 13,
                color: "black",
            }}
            backgroundColor='white'
            containerStyle={{
                borderBottomWidth: 0,
            }}
            hideChevron={this.props.hideChevron}

            rightIcon={
                <View style = {{flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
                
                        <MaterialIcons         
                            name= 'add-circle-outline'
                            style={{                           
                                fontSize: 24,
                                color: 'black',
                            }}
                            onPress={()=>{
                                firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid 
                                    + '/' + this.props.title).update({count:this.props.count + 1})
                            }}
                        />
                        <Text style={{fontWeight:'bold',color:'black',fontSize:24}}>
                            {this.props.count}</Text>
                        <MaterialIcons         
                            name= 'remove-circle-outline'
                            style={{                           
                                fontSize: 24,
                                color: 'black',
                            }}
                            onPress={()=>{
                                if(this.props.count>0){firebase.database().ref('listofroles/' + firebase.auth().currentUser.uid 
                                    + '/' + this.props.title).update({count:this.props.count - 1})
                                }
                            }}
                        />
                   
                </View>
            }

      />
    )
}
}