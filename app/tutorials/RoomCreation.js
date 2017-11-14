
import React, { Component } from 'react';
import {
    Text,
    TextInput,
    View,
    Image,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
    TouchableWithoutFeedback,
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuButton } from '../components/MenuButton.js';

import { StackNavigator, TabNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import Rolesheet from '../misc/roles.json';
import firebase from '../firebase/FirebaseController.js';
import colors from '../misc/colors.js';

import * as Animatable from 'react-native-animatable';

export class Creation1 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            alias:'',
        };
    }

    _validName(name) {
        if(name.length>0 && name.length < 11){
            return true
        } else {
            alert('Name is not a valid length (10 characters or less)')
            return false
        }
    }

    render() {
        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:colors.main}}>

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

                <View style = {{flexDirection:'row', flex:0.1, marginTop:20, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.7}}> 
                        <Text style = {styles.concerto}>Room Code</Text>
                        <Text style = {styles.roomcode}>ABCD</Text>
                    </View>
                </View>

                <View style = {{flex:0.2, justifyContent:'center', alignItems:'center'}}>

                    <View style = {{ flexDirection: 'row'}}>
                        <TextInput
                            placeholder="Who are you?"
                            placeholderTextColor={colors.font}
                            style={{
                                backgroundColor: colors.main,
                                flex:0.6,
                                fontFamily:'ConcertOne-Regular',
                                fontSize: 20,
                                color:colors.font,
                                textAlign:'center',
                            }}
                            value={this.state.alias}
                            autoFocus = {true}
                            onChangeText = {(text) => {this.setState({alias: text})}}
                            onSubmitEditing = {()=>{ 
                                this.props.navigation.navigate('Creation2')
                            }}
                        />
                    </View>

                </View>
            </View>
        </TouchableWithoutFeedback>
    }
}

export class Creation2 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            alias:'',

            playercount: null,
            xPosition: 0,
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
        if(this.state.playercount.length > 1){
            this.setState({
                playercount: this.state.playercount.slice(0,1)
            })
        } else {
            this.setState({
                playercount: null
            })
        }
    }
    _done() {
        if(this.state.playercount < 6 || this.state.playercount > 15){
            this.refs.error.shake(800)
        } else {
            this.props.navigation.navigate('Creation3')
        }
    }

    render() {
        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:colors.main}}>

                <View style = {{flexDirection:'row', flex:0.1, marginTop:10, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.85}}/>
                    <TouchableOpacity
                        style = {{flex:0.15}}
                        onPress = {()=>{
                            this.props.navigation.dispatch(
                                NavigationActions.reset({
                                    index: 0,
                                    actions: [
                                    NavigationActions.navigate({ routeName: 'Room_Screen'})
                                    ]
                                })
                            );
                        }} >
                        <MaterialCommunityIcons name='close'
                            style={{color:colors.font,fontSize:30}}/>
                    </TouchableOpacity>
                </View>

                <View style = {{flexDirection:'row', flex:0.1, marginTop:20, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.7}}> 
                        <Text style = {styles.concerto}>Room Code</Text>
                        <Text style = {styles.roomcode}>ABCD</Text>
                    </View>
                </View>

                <View style = {{flex:0.3,backgroundColor:colors.main,
                    justifyContent:'center', alignItems:'center'}}>
                    <Text style = {styles.concerto}>How many Players?</Text>

                    <View style = {{flex:0.5, flexDirection:'row'}}>
                        <TouchableOpacity
                            style = {{flex:0.25, backgroundColor:colors.font, marginTop:10,
                                borderRadius:10, justifyContent:'center', alignItems:'center'}}
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
                            <MaterialCommunityIcons name='close-circle'
                                style={{color:'#f84416',fontSize:30}}/></TouchableOpacity>
                        <TouchableOpacity style = {styles.digit}
                            onPress = {()=>{this._digit(0)}}><Text style={styles.dconcerto}>
                            0</Text></TouchableOpacity>
                        <TouchableOpacity style = {styles.symbol}
                            onPress = {()=>{this._done()}}>
                            <MaterialCommunityIcons name='check-circle'
                                style={{color:'#00e600',fontSize:30}}/></TouchableOpacity>
                    </View>
                </View>

            </View>
        </TouchableWithoutFeedback>
    }
}

export class Creation3 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alias:'',
        };
    }

    _selectDifficulty(difficulty) {
        this.props.navigation.navigate('Creation4')
    }

    render() {
        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:colors.main}}>

                <View style = {{flexDirection:'row', flex:0.1, marginTop:10, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.85}}/>
                    <TouchableOpacity
                        style = {{flex:0.15}}
                        onPress = {()=>{
                            this.props.navigation.dispatch(
                                NavigationActions.reset({
                                    index: 0,
                                    actions: [
                                    NavigationActions.navigate({ routeName: 'Room_Screen'})
                                    ]
                                })
                            );
                        }} >
                        <MaterialCommunityIcons name='close'
                            style={{color:colors.font,fontSize:30}}/>
                    </TouchableOpacity>
                </View>

                <View style = {{flexDirection:'row', flex:0.1, marginTop:20, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.7}}> 
                        <Text style = {styles.concerto}>Room Code</Text>
                        <Text style = {styles.roomcode}>ABCD</Text>
                    </View>
                </View>

                <View style = {{flex:0.2,backgroundColor:colors.main, 
                    justifyContent:'center', alignItems:'center'}}>
                    <Text style = {styles.concerto}>How experienced</Text>
                    <Text style = {styles.concerto}>is your Group?</Text>
                </View>

                <TouchableOpacity
                    style = {{flex:0.15, justifyContent:'center', alignItems:'center'}}
                    onPress = {()=>{
                        this._selectDifficulty(1)
                    }}
                >
                    <MaterialCommunityIcons name='star-circle'
                        style={{color:colors.font,fontSize:30}}/>
                    <Text style = {styles.concerto}>New</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style = {{flex:0.15, justifyContent:'center', alignItems:'center'}}
                    onPress = {()=>{
                        this._selectDifficulty(2)
                    }}
                >
                    <View style = {{flexDirection:'row'}}>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:colors.font,fontSize:30}}/>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:colors.font,fontSize:30}}/>
                    </View>
                <Text style = {styles.concerto}>Normal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style = {{flex:0.15, justifyContent:'center', alignItems:'center'}}
                    onPress = {()=>{
                        this._selectDifficulty(3)
                    }}
                >   
                    <View style = {{flexDirection:'row'}}>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:colors.font,fontSize:30}}/>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:colors.font,fontSize:30}}/>
                        <MaterialCommunityIcons name='star-circle'
                            style={{color:colors.font,fontSize:30}}/>
                    </View>
                    <Text style = {styles.concerto}>Difficult</Text>
                </TouchableOpacity>

            </View>
        </TouchableWithoutFeedback>
    }
}

export class Creation4 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            alias:'',
        };
    }

    render() {
        return <TouchableWithoutFeedback 
        style = {{ flex:1 }}
        onPress={()=>{ Keyboard.dismiss() }}>
            <View style = {{flex:1,backgroundColor:colors.main}}>

                <View style = {{flexDirection:'row', flex:0.1, marginTop:10, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.85}}/>
                    <TouchableOpacity
                        style = {{flex:0.15}}
                        onPress = {()=>{
                            this.props.navigation.dispatch(
                                NavigationActions.reset({
                                    index: 0,
                                    actions: [
                                    NavigationActions.navigate({ routeName: 'Room_Screen'})
                                    ]
                                })
                            );
                        }} >
                        <MaterialCommunityIcons name='close'
                            style={{color:colors.font,fontSize:30}}/>
                    </TouchableOpacity>
                </View>

                <View style = {{flexDirection:'row', flex:0.1, marginTop:20, 
                    justifyContent:'center',alignItems:'center'}}>
                    <View style = {{flex:0.7}}> 
                        <Text style = {styles.concerto}>Room Code</Text>
                        <Text style = {styles.roomcode}>ABCD</Text>
                    </View>
                </View>

                <View style = {{flex:0.2,backgroundColor:colors.main, 
                    justifyContent:'center', alignItems:'center'}}>

                    <View style = {{ flexDirection: 'row'}}>
                        <TextInput
                            placeholder="Who are you?"
                            placeholderTextColor={colors.font}
                            style={{
                                backgroundColor: colors.main,
                                flex:0.6,
                                fontFamily:'ConcertOne-Regular',
                                fontSize: 20,
                                color:colors.font,
                                textAlign:'center',
                            }}
                            value={this.state.alias}
                            onChangeText = {(text) => {this.setState({alias: text})}}
                        />
                    </View>

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
        color: colors.main,
    },
    dconcerto: {
        fontSize: 20,
        fontFamily: 'ConcertOne-Regular',
        textAlign:'center',
        color: colors.main,
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
        backgroundColor:colors.main, 
        borderRadius:10,
        margin:5
    },
    

});