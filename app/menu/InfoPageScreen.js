import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native';

import { Button } from '../components/Button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class InfoPageScreen extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            infolist: [],
            title:null,

            page: 1,
            lastpage: 10,
        }

        this.height = Dimensions.get('window').height;
        this.width = Dimensions.get('window').width;
    }


    componentWillMount(){
        this._newPage(this.state.page)
    }

    _renderListItem(item) {
        if(item.type == 1){
            return <View style = {styles.detailContainer}>
                <Text style = {styles.detail}>{item.desc}</Text>
            </View>
        } else if (item.type == 2){
            return <View style = {styles.commentContainer}>
                <Text style = {styles.comment}>{item.desc}</Text>
            </View>
        } else if (item.type == 3){
            return <View style = {styles.linkContainer}><Button size = {0.15} backgroundColor = {colors.link}
                onPress = {()=>{this.props.navigation.navigate('InfoPage',{section:item.route})}}>
                <Text style = {styles.link}>{item.desc}</Text>
            </Button></View>
        }
    }

    _pageBack() {
        this._newPage(this.state.page>1?this.state.page-1:1)
    }
    _pageForward() {
        this._newPage(this.state.page<this.state.lastpage?this.state.page+1:this.state.page)
    }

    _newPage(page){
        const { params } = this.props.navigation.state;
        const section = params.section;

        var keys = Object.keys((Rules[section])[page]).sort()
        var infolist = [];
        keys.forEach(function(key){
            infolist.push({
                type:           ((Rules[section])[page])[key].type,
                desc:           ((Rules[section])[page])[key].desc,
                route:          ((Rules[section])[page])[key].route,
                key:            key,
            })
        })
        this.setState({
            infolist:   infolist,
            section:    section,
            page:       page,
            title:      (Rules.headers)[section],
            lastpage:       Object.keys(Rules[section]).length,
        })
    }

    render(){
        return <View style = {{ flex:1, alignItems:'center' }}>

            <View style = {{flexDirection:'row', alignSelf:'center'}}>
                <TouchableOpacity onPress = { () => this.props.navigation.dispatch(NavigationActions.back()) }>
                    <MaterialCommunityIcons name='chevron-left'
                    style={styles.chevron}/>
                </TouchableOpacity>
                <Text style = {styles.header}>{this.state.title}</Text>
                
            </View>
            
            <View style = {{flex:1, width:this.width*0.8, backgroundColor:colors.font,borderRadius:15}}>
                <FlatList
                    data={this.state.infolist}
                    renderItem={({item}) => this._renderListItem(item) }
                    keyExtractor={item => item.key}
                />
            </View>

            <TouchableOpacity style = {{position:'absolute', left:0, top:0, bottom:0, width:this.width*0.13}}
                onPress = {()=>{ this._pageBack() }}/>

            <TouchableOpacity style = {{position:'absolute', right:0, top:0, bottom:0, width:this.width*0.13}}
                onPress = {()=>{ this._pageForward() }}/>

        </View>
    }
}

export default InfoPageScreen