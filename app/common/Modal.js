import React, { Component } from 'react';
import {
    View,
    Text,
    Animated,
    Dimensions
} from 'react-native';

import CloseButton from '../components/CloseButton';
import Card from './Card';

const { height, width } = Dimensions.get("window")

class Modal extends Component {

    
    constructor(props) {
        super(props);

        this.on = new Animated.Value(0);
        this.opacity = new Animated.Value(0);
        
    }

    componentDidMount(){
        this._show(this.props.visible)
    }

    componentWillReceiveProps(newProps){
        if(newProps.visible?!this.props.visible:this.props.visible){
            this._show(newProps.visible)
        }
    }

    _show(view) {
        Animated.timing(
            this.on,{
                toValue:view?1:0,
                duration:500
            }
        ).start()
    }

    render() {

        const { visible, children, onClose } = this.props

        if(!visible) return null

        return ( 
            <Animated.View style = {{
                justifyContent:'center',
                height,
                width,
                opacity:this.on.interpolate({
                    inputRange:[0,1],
                    outputRange:[0,1]
                }),
                backgroundColor: 'transparent',
            }}>
                <Card cardStyle = {{
                    height:0.8*height,
                    width:0.85*width
                }}>
                    {children}
                </Card>
                <CloseButton onPress = {onClose} />
            </Animated.View>
        )
    }
}

export default Modal
