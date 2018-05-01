import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated
} from 'react-native';

import playerModule from '../mods/playerModule';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class PlayerButton extends Component {

    constructor(props) {
        super(props);

        this.state ={
            disabled:false,
            depth:6
        }
        
    }
        
    handlePressIn(){
        this.setState({
            depth:3
        })
    }

    handlePressOut(){
        this.buttonPress()
    }

    buttonPress() {
        this.setState({
            disabled:true,
            depth:6
        })
        this.timer = setTimeout(() => this.setState({disabled: false}), 50);
    }

    componentWillUnmount(){
        if(this.timer){
            clearTimeout(this.timer)
        }
        
    }

    //Pressing any name button
    onPress(item){

        playerModule.notification('You have selected ' + item.name + '.')
        playerModule.selectChoice(item.key)
            
    }

    render() {

        const { item } = this.props

        return (
            <View style = {{
                height:50,
                width:180,
                opacity:item.dead?0.6:1,
                justifyContent:'center'
            }}>
                <View style = {{
                    marginTop:6-this.state.depth,
                    backgroundColor: colors.dead,
                    borderRadius:15,
                }}>
                    <TouchableOpacity style = {{
                        justifyContent:'center',
                        alignItems:'center',
                        backgroundColor: colors.font, 
                        borderRadius:15,
                    }}
                        onPress = {()=>{
                            this.onPress(item)
                        }}
                        onPressIn = {()=>{
                            this.handlePressIn()
                        }}
                        onPressOut = {()=>{
                            this.handlePressOut()
                        }}
                        activeOpacity = {1}
                        disabled = {this.props.disabled || this.state.disabled}>
                        
                        <View style = {{flexDirection:'row', borderWidth:1}}>
                            <View style = {{flex:0.3,justifyContent:'center',alignItems:'center'}}>
                            <MaterialCommunityIcons name={item.dead?'skull':item.readyvalue?
                                'check-circle':(item.immune?'needle':(item.status?item.statusname:null))}
                                style={{color:colors.shadow, fontSize:15, alignSelf:'center'}}/>
                            </View>
                            <View style = {{flex:0.7, justifyContent:'center'}}>
                                <Text style = {styles.player}>{item.dead?item.name + ' (' + Rolesheet[item.roleid].name + ') ':
                                    item.name}</Text>
                            </View>
                        </View>

                    </TouchableOpacity>

                    <View style = {{height:this.state.depth}}/>
                </View>
            </View>
        )
    }
}

const styles = {
    player: {
        fontSize: 16,
        fontFamily: 'FredokaOne-Regular',
        color: colors.shadow,
        margin:5,
    },
    
}

export default PlayerButton
