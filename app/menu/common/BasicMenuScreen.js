import React, { Component } from 'react';
import {
    Text,
    View,
}   from 'react-native';

import { Button } from '../../components/Button.js';

import colors from '../../misc/colors.js';


class BasicMenuScreen extends Component {

    constructor(props) {
        super(props);
    }

    //TODO: Create button in bottom left
    _deleteRoom() {
        AsyncStorage.removeItem('ROOM-KEY');
        AsyncStorage.removeItem('GAME-KEY');
        this.props.screenProps.navigate('Home')
    }

    //TODO i don't like how this is done ew
    _renderQuit(){
        /*if(this.props.screenProps.quit){
            return <Button
                horizontal = {0.4}
                onPress = {()=>{ this._deleteRoom() }}
                ><Text style = {styles.listfont}>Quit</Text>
            </Button>
        } else return null*/
    }

    render(){
        return <View>

            <Button
                horizontal = {0.4}
                margin = {10}
                onPress = {()=>
                    this.props.navigation.navigate('Roles')
                }
                ><Text style = {styles.listfont}>Roles</Text>
            </Button>
                
            <Button
                horizontal = {0.4}
                margin = {10}
                onPress = {()=>
                    this.props.navigation.navigate('Menu',{menu:'rules'}) 
                }
                ><Text style = {styles.listfont}>Rulebook</Text>
            </Button>

            <Button
                horizontal = {0.4}
                margin = {10}
                onPress = {()=>{ 
                    this.props.navigation.navigate('InfoPage',{section:'about'})
                }}
                ><Text style = {styles.listfont}>About</Text>
            </Button>

            {this._renderQuit()}
            
        </View>
    }
}

const styles = {

    listfont: {
        fontFamily:'FredokaOne-Regular',
        fontSize:22,
        alignSelf:'center',
        color:colors.shadow,
        margin:4,
    },

}

export default BasicMenuScreen