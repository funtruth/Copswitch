import React, { Component } from 'react'
import { connect } from 'react-redux'

import { TextInput } from '@components'
import { nameUtil } from '@services'

import { updateProperty } from '../ProfileReducer'

class NameInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.profile[props.field],
            valid: true,
            invalidChars: []
        }
    }

    _onChangeText = (text) => {
        const { field, updateProperty } = this.props
        const { valid, invalidChars } = nameUtil.checkIfValidName(text)

        this.setState({
            [field]: text,
            valid,
            invalidChars
        })
        updateProperty({ [`${field}Edit`]: text })
    }

    render() {
        return (
            <TextInput
                value={this.state.value}
                onChangeText={this._onChangeText}
                autoCapitalize={'words'}
            />
        )
    }
}

export default connect(
    state => ({
        profile: state.profile
    }),
    dispatch => {
        return {
            updateProperty: (obj) => dispatch(updateProperty(obj))
        }
    }
)(NameInput)