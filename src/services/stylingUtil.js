import PreText from 'pretext'

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

export default stylingUtil = new PreText(styles, config)
