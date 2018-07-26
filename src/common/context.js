import { Context }  from 'react-native-pretext'

const defaultStyle = {
    fontFamily: 'BarlowCondensed-Regular',
    color: '#FFFFFF'
}

const context = {
    '$': {
        color: 'red'
    },
    '&': {
        color: 'yellow'
    }
}

const config = {

}

export default Context.give(defaultStyle, context, config)
