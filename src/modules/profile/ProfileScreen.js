import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import { Button } from '@components'
import { nameUtil } from '@services'
import AvatarPicker from './components/AvatarPicker'
import NameInput from './components/NameInput'

import { updateProperty } from './ProfileReducer'

class ProfileScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: props.firstName,
            lastName: props.lastName
        }
    }

    _onSubmit = () => {
        const { firstNameEdit, lastNameEdit } = this.props.profile
        const fullName = `${firstNameEdit} ${lastNameEdit}`.trim()
        const { valid } = nameUtil.checkIfValidName(fullName, { allowSpaces: true })

        if (!valid) return

        this.props.updateProperty({
            firstName: firstNameEdit,
            lastName: lastNameEdit,
            fullName
        })
        
        //TODO close window or w.e
    }

    render() {
        return (
            <View style = {{flex:1, backgroundColor:'red', justifyContent: 'center'}}>
                <NameInput field={'firstName'}/>
                <NameInput field={'lastName'}/>
                <Button
                    onPress={this._onSubmit}
                    disabled={!this.props.profile.firstNameEdit && !this.state.firstName}
                />
            </View>
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
)(ProfileScreen)