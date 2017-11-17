
import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    Image,
    StyleSheet,
    AsyncStorage,
    Keyboard,
    TouchableOpacity,
    TouchableWithoutFeedback,
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuButton } from '../components/MenuButton.js';

import { NavigationActions } from 'react-navigation';

import Rolesheet from '../misc/roles.json';
import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';

import * as Animatable from 'react-native-animatable';

export class Join1 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            alias:'',
            errormessage:null,
        };
        
    }

    _continue(name) {

        if(name.length>0 && name.length < 11){
            firebase.database().ref('rooms').child(this.state.roomname).child('listofplayers')
            .child(firebase.auth().currentUser.uid).update({
                name:           name,
                actionbtnvalue: false,
                presseduid:     'foo',
            }).then(()=>{
                this.setState({errormessage:null})
                this.props.navigation.navigate('Join2')
            })
        } else {
            this.setState({errormessage:'Your name must be 1 - 10 Characters'})
            this.refs.nameerror.shake(800)
        }
    }

    render() {

        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:colors.background}}>

                <View style = {{flexDirection:'row', flex:0.1, marginTop:10, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.85}}/>
                    <TouchableOpacity
                        style = {{flex:0.15}}
                        onPress = {()=>{
                            this.props.navigation.dispatch(NavigationActions.back());
                        }} >
                        <MaterialCommunityIcons name='close'
                            style={{color:colors.font,fontSize:30}}/>
                    </TouchableOpacity>
                </View>

                <View style = {{flexDirection:'row', flex:0.1, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.7}}> 
                        <Text style = {styles.concerto}>Room Code</Text>
                        <Text style = {styles.roomcode}>{this.state.roomname}</Text>
                    </View>
                </View>

                <View style = {{flex:0.1}}/>

                <View style = {{flex:0.2, justifyContent:'center', alignItems:'center'}}>
                    <View style = {{flex:0.4,flexDirection:'row'}}>
                        <TextInput
                            ref={(input) => { this.textInput = input; }}
                            placeholder="Who are you?"
                            placeholderTextColor={colors.font}
                            style={{
                                backgroundColor: colors.background,
                                flex:0.6,
                                fontFamily:'ConcertOne-Regular',
                                fontSize: 20,
                                color:colors.font,
                                textAlign:'center',
                            }}
                            value={this.state.alias}
                            onChangeText = {(text) => {this.setState({alias: text})}}
                            onSubmitEditing = {()=>{ 
                                this._continue(this.state.alias);
                            }}
                        />
                    </View>
                    <View style = {{flex:0.6}}>
                    <Animatable.Text style = {styles.sconcerto} ref = 'nameerror'>
                    {this.state.errormessage}</Animatable.Text></View>
                </View>

                <View style = {{flex:0.4}}/>
                    
                <View style = {{flex:0.1, flexDirection:'row', 
                    justifyContent:'center', alignItems:'center'}}>
                    <MaterialCommunityIcons name='checkbox-blank-circle'
                        style={{color:colors.font,fontSize:15}}/>
                    <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                        style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                </View>
            </View>
        </TouchableWithoutFeedback>
    }
}

export class Join2 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            alias:'',
            roomname:'',
            loading:true,
        };        
    }


    _digit(digit) {
        if(this.state.playercount){
            if(this.state.playercount.length > 1){
                this.refs.error.shake(800)
            } else {
                this.setState({
                    playercount: this.state.playercount + digit.toString()
                })
            }
        } else {
            this.setState({
                playercount: digit
            })
        }
    }
    _backspace() {
        this.setState({ playercount: null })
    }
    _done() {
        if(this.state.playercount < 6 || this.state.playercount > 15){
            this.refs.error.shake(800)
            this.setState({playercount:null})
        } else {
            firebase.database().ref('rooms').child(this.state.roomname).update({
                playernum: Number(this.state.playercount)
            }).then(()=>{
                this.props.navigation.navigate('Creation3')
            })
        }
    }

    render() {

        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:colors.background}}>

                <View style = {{flexDirection:'row', flex:0.1, marginTop:10, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.85}}/>
                    <TouchableOpacity
                        style = {{flex:0.15}}
                        onPress = {()=>{
                            this.props.navigation.dispatch(NavigationActions.back())
                        }} >
                        <MaterialCommunityIcons name='close'
                            style={{color:colors.font,fontSize:30}}/>
                    </TouchableOpacity>
                </View>

                <View style = {{flexDirection:'row', flex:0.1,
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.7}}> 
                        <Text style = {styles.concerto}>Room Code</Text>
                        <Text style = {styles.roomcode}>{this.state.roomname}</Text>
                    </View>
                </View>

                <View style = {{flex:0.3,backgroundColor:colors.background,
                    justifyContent:'center', alignItems:'center'}}>
                    <Text style = {styles.concerto}>How many Players?</Text>

                    <View style = {{flex:0.5, flexDirection:'row'}}>
                        <TouchableOpacity
                            style = {{flex:0.25, backgroundColor:colors.font, marginTop:10,
                                borderRadius:15, justifyContent:'center', alignItems:'center'}}
                        >
                            <Text style = {styles.bigdarkconcerto}>
                                {this.state.playercount?this.state.playercount:'?'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style = {{flex:0.35, justifyContent:'center', alignItems:'center'}}>
                    <Animatable.Text style = {styles.sconcerto}
                        ref='error'>
                        Must be a number from 6 - 15</Animatable.Text>
                    <View style = {{flex:0.25, flexDirection:'row'}}>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(1)}}><Text style={styles.dconcerto}>
                            1</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(2)}}><Text style={styles.dconcerto}>
                            2</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(3)}}><Text style={styles.dconcerto}>
                            3</Text></TouchableOpacity>
                    </View>
                    <View style = {{flex:0.25, flexDirection:'row'}}>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(4)}}><Text style={styles.dconcerto}>
                            4</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(5)}}><Text style={styles.dconcerto}>
                            5</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(6)}}><Text style={styles.dconcerto}>
                            6</Text></TouchableOpacity>
                    </View>
                    <View style = {{flex:0.25, flexDirection:'row'}}>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(7)}}><Text style={styles.dconcerto}>
                            7</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(8)}}><Text style={styles.dconcerto}>
                            8</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(9)}}><Text style={styles.dconcerto}>
                            9</Text></TouchableOpacity>
                    </View>
                    <View style = {{flex:0.25, flexDirection:'row'}}>
                        <TouchableOpacity style = {styles.symbol}
                            onPress = {()=>{this._backspace()}}>
                            <Text style = {styles.sconcerto}>CLEAR</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(0)}}><Text style={styles.dconcerto}>
                            0</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.symbol}
                            onPress = {()=>{this._done()}}>
                            <Text style = {styles.sconcerto}>NEXT</Text></TouchableOpacity>
                    </View>
                </View>

                <View style = {{flex:0.05}}/>

                <View style = {{flex:0.1, flexDirection:'row', 
                justifyContent:'center', alignItems:'center'}}>
                    <MaterialCommunityIcons name='checkbox-blank-circle-outline'
                        style={{color:colors.font,fontSize:15}}/>
                    <MaterialCommunityIcons name='checkbox-blank-circle'
                        style={{color:colors.font,fontSize:15, marginLeft:20}}/>
                </View>

            </View>
        </TouchableWithoutFeedback>
    }
}


const styles = StyleSheet.create({
    roomcode: {
        fontSize: 40,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    sconcerto: {
        fontSize: 15,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    concerto: {
        fontSize: 20,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.font,
    },
    bigdarkconcerto: {
        fontSize: 40,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.background,
    },
    dconcerto: {
        fontSize: 20,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.background,
    },
    digit: {
        flex:0.2,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.font, 
        borderRadius:10,
        margin:5
    },
    symbol: {
        flex:0.2,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.background, 
        borderRadius:10,
        margin:5
    },
    

});