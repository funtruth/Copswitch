import React, { Component } from 'react';
import {
    Text,
    View,
}   from 'react-native';

import { Button } from '@components';

class BasicMenuScreen extends Component {
    constructor(props) {
        super(props);
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
            
        </View>
    }
}

const styles = {

    listfont: {
        fontFamily:'FredokaOne-Regular',
        fontSize:22,
        alignSelf:'center',
        margin:4,
    },

}

export default BasicMenuScreen