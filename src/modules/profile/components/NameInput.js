import React from 'react'
import { TextInput } from '@components'

import { nameUtil } from '@services'

const NameInput = (props) => {
    _onSubmit = (name) => {
        nameUtil.checkIfValidName(name)
    }
    
    return (
        <TextInput


        />
    )
}

export default NameInput