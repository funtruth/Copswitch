import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

const fontFamily = {
    Regular: 'BarlowCondensed-Regular',
    Medium: 'BarlowCondensed-Medium',
    Bold: 'BarlowCondensed-Bold',
    SemiBold: 'BarlowCondensed-SemiBold'
}

const color = {
    dark: '#372C24',
    font: '#A6895D', 
    light: '#A6895D',
    title: '#A38455',
    gradient: ['#3A2F26', '#2E2620'],
    buttonGradient: ['#A6895D', '#463B2A']
}

const constant = {
    menuWidth: width - 50,
    menuHeight: 0.7 * height,
    menuHeaderHeight: 125
}

export {
    fontFamily,
    color,
    constant
}