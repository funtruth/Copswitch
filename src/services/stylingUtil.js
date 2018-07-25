import Hext from './hext'

const styles = {
    '$': {
        color: 'red'
    },
    '&': {
        color: 'yellow'
    }
}

const config = {
    defaultStyle: {
        fontFamily: 'BarlowCondensed-Regular',
        color: '#FFFFFF'
    }
}

export default stylingUtil = new Hext(styles, config)
