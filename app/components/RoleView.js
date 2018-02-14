import React, { Component } from 'react';
import {
    Text,
    View,
    FlatList,
    Animated,
    Dimensions,
}   from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import { CustomButton } from './CustomButton.js';

import Rolesheet from '../misc/roles.json';
import firebase from '../firebase/FirebaseController.js';

import colors from '../misc/colors.js';
import styles from '../misc/styles.js';

const FADEOUT_ANIM = 300;
const SIZE_ANIM = 100;
const FADEIN_ANIM = 300;

export class RoleView extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            townlist: [],
            mafialist: [],
            roleid:   'a',
            index: 0,
            descVisible: false,

            showtown:    true,
        }

        this.height = Dimensions.get('window').height;
        this.width = Dimensions.get('window').width;
    }

    componentWillMount() {

        var keys = Object.keys(Rolesheet).sort()
        
        var townlist = [];
        var mafialist = [];

        keys.forEach(function(key){
            if(Rolesheet[key].type == 1){
                mafialist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    key:            key,
                })
            } else if (Rolesheet[key].type == 2) {
                townlist.push({
                    name:           Rolesheet[key].name,
                    index:          Rolesheet[key].index,
                    key:            key,
                })
            }
        })
        this.setState({
            mafialist:mafialist,
            townlist:townlist,
        })  
    }


    _renderItem(item){
        return <CustomButton
            vertical = {0.35}
            horizontal = {0.9}
            margin = {10}
            onPress = {() => this.props.rolepress(item.key)}
        ><Text numberOfLines = {1} style = {styles.charfont}>{item.name}</Text>
        </CustomButton>
    }

    render(){
        return <View style = {{backgroundColor:colors.background}}>

            <View style = {{ marginBottom:10, justifyContent:'center', flexDirection:'row' }}>
                
                <CustomButton
                    vertical = {0.16}
                    horizontal = {1}
                    style = {{
                        borderBottomRightRadius:0,
                        borderTopRightRadius:0,
                    }}
                    opacity={this.state.showtown?1:0.4}
                    onPress = {()=>{ this.setState({ showtown:true }) }}
                >
                    <Foundation name='shield'
                        style={{color:colors.shadow,fontSize:25,alignSelf:'center',margin:3}}/>
                </CustomButton>
                
                <CustomButton
                    vertical = {0.16}
                    horizontal = {1}
                    style = {{
                        borderBottomLeftRadius:0,
                        borderTopLeftRadius:0,
                    }}
                    opacity={this.state.showtown?0.4:1}
                    onPress = {()=>{ this.setState({ showtown:false }) }}
                >
                    <Foundation name='skull'
                        style={{color:colors.shadow,fontSize:25,alignSelf:'center',margin:3}}/>
                </CustomButton>
            </View>

            <View style = {{height:this.height/2}}>
                <FlatList
                    data={this.state.showtown?this.state.townlist:this.state.mafialist}
                    renderItem={({item}) => this._renderItem(item)}
                    showsVerticalScrollIndicator = {false}
                    columnWrapperStyle = {{alignSelf:'center'}}
                    numColumns={2}
                    keyExtractor={item => item.key}/>
            </View>

        </View>

    }
}