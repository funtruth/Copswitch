import React from "react";
import { 
    View
} from "react-native";

import { onSignIn } from "../auth";
import { MenuButton } from '../components/MenuButton.js';

import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';

import { NavigationActions } from 'react-navigation';

export class Splash extends React.Component {
    
    constructor(props) {
        super(props);
    }

    _signInAnon(){
        firebase.auth().signInAnonymously().then(() => {
            onSignIn().then(()=>{
                this.props.navigation.dispatch(
                    NavigationActions.reset({
                        key: null,
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'SignedIn'})
                        ]
                    })
                )
            })
        }).catch(function(error){alert(error)})
    }

    render(){
        return <View style = {{flex:1,backgroundColor:colors.background,
            justifyContent:'center',alignItems:'center'}}>
            <View style = {{flex:0.92}}/>
            <MenuButton
                viewFlex = {0.12}
                flex = {0.9}
                title="Continue Anonymously"
                fontSize={25}
                onPress={()=>{
                    this._signInAnon();
                }}
            />
            <View style = {{flex:0.06}}/>
        </View>
    }
};
