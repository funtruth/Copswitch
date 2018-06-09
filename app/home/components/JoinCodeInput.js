import React, { Component } from 'react'
import {
    View,
    TextInput,
    Keyboard,
    Dimensions
}   from 'react-native'

import colors from '../../misc/colors.js'

const { height, width } = Dimensions.get('window')

const digits = [
    {id:0},
    {id:1},
    {id:2},
    {id:3}
]

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
    }
}

class CodeInput extends Component {
    state = {
        currentIndex: 0,
        codeArr: new Array(4).fill('')
    }
    codeInputRefs = []

    _setFocus = (index) => this.codeInputRefs[index].focus()

	_blur = (index) => this.codeInputRefs[index].blur()

    _onFocus = (index) => () => {
		const {codeArr} = this.state
		const newCodeArr = codeArr.map((v, i) => (i < index ? v : ''))

		this.setState({
			codeArr: newCodeArr,
			currentIndex: index,
		})
    }

    _onKeyPress = (e) => {
		if (e.nativeEvent.key === 'Backspace') {
			const {currentIndex} = this.state
			const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0
			this._setFocus(nextIndex)
		}
	}

	_onInputCode = index => character => {
		let newCodeArr = this.state.codeArr
		newCodeArr[index] = character

		if (index == 3) {
            const code = newCodeArr.join('')
            this.props.onFulfill(code)
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

    render() {
        const { activeWrapper, wrapper, inputText } = styles

        const JoinCodeInput = digits.map((item) => (
            <TextInput
                key={item.id}
                ref={ref => this.codeInputRefs[item.id] = ref}
                value={this.state.codeArr[item.id]}
                style={this.state.currentIndex === item.id?[activeWrapper,inputText]:[wrapper,inputText]}
				underlineColorAndroid='transparent'
                autoFocus={item.id === 0}
				onFocus={this._onFocus(item.id)}
                onChangeText={this._onInputCode(item.id)}
				onKeyPress={this._onKeyPress}
                keyboardType='numeric'
                maxLength={1}
            />
        ))

        return <View style={{flexDirection:'row'}} children={JoinCodeInput}/>
    }
}

export default CodeInput