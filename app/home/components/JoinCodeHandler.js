import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    Dimensions
}   from 'react-native'
import _ from 'lodash'
import { Button } from '../../components/index.js';

const { height, width } = Dimensions.get('window')

class CodeHandler extends Component {
    state = {
        currentIndex: 0,
        codeArr: new Array(4).fill('')
    }
    codeInputRefs = []

    componentWillReceiveProps(newProps) {
        if (newProps.error && newProps.error !== this.props.error) {
            this._setFocus(0)
        }
    }

    _setFocus(index) {
        this.codeInputRefs[index].focus()
    }

	_blur(index) {
        this.codeInputRefs[index].blur()
    }

    _onFocus(index) {
        let newCodeArr = _.clone(this.state.codeArr);
        const currentEmptyIndex = _.findIndex(newCodeArr, c => !c);
        if (currentEmptyIndex !== -1 && currentEmptyIndex < index) {
            return this._setFocus(currentEmptyIndex);
        }
        for (const i in newCodeArr) {
            if (i >= index) {
                newCodeArr[i] = '';
            }
        }
        
        this.setState({
            codeArr: newCodeArr,
            currentIndex: index
        })
    }

    _onKeyPress(e) {
		if (e.nativeEvent.key === 'Backspace') {
			const {currentIndex} = this.state
			const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0
			this._setFocus(nextIndex)
		}
	}

	_onInputCode(character, index) {
		let newCodeArr = _.clone(this.state.codeArr)
		newCodeArr[index] = character

		if (index == 3) {
			this._blur(this.state.currentIndex)
		} else {
			this._setFocus(this.state.currentIndex + 1)
		}

		this.setState(prevState => {
			return {
				codeArr: newCodeArr,
				currentIndex: prevState.currentIndex + 1,
			}
		})
    }
    
    _onSubmit = () => {
        let newCodeArr = this.state.codeArr
        const code = newCodeArr.join('')

        this.props.onFulfill(code)
    }

    render() {
        const { onFulfill } = this.props
        const { activeWrapper, wrapper, inputText,
            submitButton, submitText } = styles

        let enableSubmit = this.state.codeArr[3] !== ''

        let codeInputs = []
        for(var i=0; i<4; i++){
            const id = i;
            codeInputs.push(
                <TextInput
                    key={id}
                    ref={ref => (this.codeInputRefs[id] = ref)}
                    style={this.state.currentIndex === id?[activeWrapper,inputText]:[wrapper,inputText]}
                    underlineColorAndroid="transparent"
                    keyboardType={'phone-pad'}
                    returnKeyType={'done'}
                    {...this.props}
                    autoFocus={id === 0}
                    onFocus={() => this._onFocus(id)}
                    value={this.state.codeArr[id] ? this.state.codeArr[id].toString() : ''}
                    onChangeText={text => this._onInputCode(text, id)}
                    onKeyPress={(e) => this._onKeyPress(e)}
                    maxLength={1}
                />
            )}

        return (
            <View>
                <View style={{flexDirection:'row'}}>
                    {codeInputs}
                </View>
                <Button style={submitButton} onPress={this._onSubmit} disabled={!enableSubmit}>
                    <Text style={submitText}>SUBMIT</Text>
                </Button>
            </View>
        )
    }
}

const styles = {
    activeWrapper: {
        height: 50,
        width: 35,
        margin: 5,
        marginTop: 10,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#A6895D',
        backgroundColor: '#FFFFFF',
    },
    wrapper: {
        height: 50,
        width: 35,
        margin: 5,
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: '#C4C4C4',
    },
    inputText: {
        fontFamily: 'BarlowCondensed-Medium',
        fontSize: 25,
        color: '#372C24',
        textAlign: 'center'
    },
    submitButton: {
        width: 0.45*width,
        height: 0.15*width,
        alignSelf: 'center'
    },
    submitText: {
        fontFamily: 'BarlowCondensed-Medium',
        fontSize: 25,
        color: '#372C24',
        margin: 10
    }
}

export default CodeHandler