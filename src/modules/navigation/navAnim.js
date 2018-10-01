import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export const fadeIn = (index, position) => {
    const inputRange = [index - 1, index, index + 1];
    const opacity = position.interpolate({
        inputRange,
        outputRange: [0, 1, 1],
    });

    return {
        opacity
    };
};

export const slideUp = (index, position) => {
    const inputRange = [index - 1, index, index + 1];
    const transform = [{
        translateY: position.interpolate({
            inputRange,
            outputRange: [height, 0, 0],
        })
    }]

    return {
        transform
    };
}

export const slideLeft = (index, position) => {
    const inputRange = [index - 1, index, index + 1];
    const transform = [{
        translateX: position.interpolate({
            inputRange,
            outputRange: [width, 0, 0],
        })
    }]

    return {
        transform
    };
}