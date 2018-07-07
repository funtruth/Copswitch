import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
} from 'react-native';

import { Button } from '@components/Button';

class MenuScreen extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            menulist: [],
        }
        
    }

    componentWillMount() {
        
        const { params } = this.props.navigation.state;
        const menu = params.menu;

        var keys = Object.keys(Menus[menu]).sort()
        var menulist = [];
        keys.forEach(function(key){
            menulist.push({
                type:           (Menus[menu])[key].type,
                desc:           (Menus[menu])[key].desc,
                route:          (Menus[menu])[key].route,
                key:            key,
            })
        })
        this.setState({
            menulist:   menulist,
        })
    }

    _renderMenuButton(item) {
        return <Button
            horizontal = {0.4}
            margin = {10}
            onPress = {()=>{item.type==1?
                this.props.navigation.navigate('Menu',{menu:item.route}) 
                :this.props.navigation.navigate('InfoPage',{section:item.route}) 
            }}><Text numberOfLines={1} style = {styles.listfont}>{item.desc}</Text>
        </Button>
        
    }

    //TODO back button
    render(){
        return <View style = {{backgroundColor:colors.background}}>

            <FlatList
                data={this.state.menulist}
                renderItem={({item}) => this._renderMenuButton(item) }
                keyExtractor={item => item.key}
            />

        </View>
    }
}

export default MenuScreen