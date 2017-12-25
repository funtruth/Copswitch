import React, { Component } from 'react';
import { View, Text } from 'react-native';

import colors from '../misc/colors.js';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomButton } from './CustomButton';

export class NumPad extends React.Component {

constructor(props) {
    super(props);
}

_clear() {
    this.props.setNumber(null)
}

render() {

    return ( 
        <View style = {{flex:this.props.flex, justifyContent:'center', alignItems:'center',
            marginLeft:10, marginRight:10, borderRadius:2, paddingTop:5, paddingBottom:5}}>
            <View style = {{flex:0.25, flexDirection:'row', marginTop:10}}>
                <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8} fontSize = {20}
                    color = {colors.digit} radius = {25} title = '1'
                    onPress = {()=>{ this.props.digit(1) }}
                />
                <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8} fontSize = {20}
                    color = {colors.digit} radius = {25} title = '2'
                    onPress = {()=>{ this.props.digit(2) }}
                />
                <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8} fontSize = {20}
                    color = {colors.digit} radius = {25} title = '3'
                    onPress = {()=>{ this.props.digit(3) }}
                />
            </View>
            <View style = {{flex:0.25, flexDirection:'row', marginTop:10}}>
                <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8} fontSize = {20}
                    color = {colors.digit} radius = {25}  title = '4'
                    onPress = {()=>{ this.props.digit(4) }}
                />
                <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8} fontSize = {20}
                    color = {colors.digit} radius = {25} title = '5'
                    onPress = {()=>{ this.props.digit(5) }}
                />
                <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8} fontSize = {20}
                    color = {colors.digit} radius = {25} title = '6'
                    onPress = {()=>{ this.props.digit(6) }}
                />
            </View>
            <View style = {{flex:0.25, flexDirection:'row', marginTop:10}}>
                <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8} fontSize = {20}
                    color = {colors.digit} radius = {25}  title = '7'
                    onPress = {()=>{ this.props.digit(7) }}
                />
                <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8} fontSize = {20}
                    color = {colors.digit} radius = {25} title = '8'
                    onPress = {()=>{ this.props.digit(8) }}
                />
                <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8} fontSize = {20}
                    color = {colors.digit} radius = {25}  title = '9'
                    onPress = {()=>{ this.props.digit(9) }}
                />
            </View>
            <View style = {{flex:0.25, flexDirection:'row', marginTop:10}}>
                <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8}
                    color = {colors.lightbutton} shadow = {colors.lightshadow} radius = {25}
                    title = 'CLEAR'
                    onPress = {()=>{ this._clear() }}
                />
                <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8} fontSize = {20}
                    color = {colors.digit} radius = {25}  title = '0'
                    onPress = {()=>{ this.props.digit(0) }}
                />
                <CustomButton size = {0.3} flex = {0.9} opacity = {1} depth = {8}
                    color = {colors.lightbutton} shadow = {colors.lightshadow} radius = {25}
                    title = 'DONE'
                    onPress = {()=>{ this.props._done() }}
                />
            </View>
        </View>
    )
}
}
