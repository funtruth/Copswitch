import React from "react";
import { 
    View, 
    Text,
    TouchableWithoutFeedback
} from "react-native";

import { onSignIn } from "../auth";

import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';
import * as Animatable from 'react-native-animatable';

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
        return <TouchableWithoutFeedback
            onPress = {()=>{ this._signInAnon() }}
            style = {{flex:1}}
            ><View style = {{flex:1,backgroundColor:colors.background,
                justifyContent:'center',alignItems:'center'}}>
                <Animatable.Text ref='start' 
                    animation = {{
                        0: {opacity:0},
                        0.25:{opacity:0.5},
                        0.5:{opacity:1},
                        0.75:{opacity:0.5},
                        4:{opacity:0},
                    }}
                    iterationCount = "infinite"
                    duration = {2000}
                    style = {{
                    fontFamily: 'ConcertOne-Regular',
                    fontSize:20,
                    color: colors.shadow,
                }}>Click to Start</Animatable.Text>
            </View>
        </TouchableWithoutFeedback>
    }
};
