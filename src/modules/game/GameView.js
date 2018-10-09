import React, { Component } from 'react'
import {
    View,
    ScrollView,
    Animated,
    TouchableOpacity,
}   from 'react-native'
import { connect } from 'react-redux'

import { ConsoleView, GameTimer, General, PlayerListView, PrivateNewsView, PrivateRoleView } from './components'
import BottomView from './screens/BottomView';
import { toggleBottomView } from './GameReducer'

const AnimatedOpacity = Animated.createAnimatedComponent(TouchableOpacity)

class GameView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bottomState: new Animated.Value(0)
        }
    }

    componentWillReceiveProps(newProps) {
        Animated.spring(
            this.state.bottomState, {
                toValue: newProps.bottomView ? 1 : 0,
                duration: 150,
                useNativeDriver: true,
            }
        ).start()
    }

    render() {
        const { events, roleId } = this.props
        
        return (
            <View style = {styles.container}>
                <Animated.View
                    style={{
                        transform: [
                            { scale: this.state.bottomState.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0.96] 
                            }) }
                        ],
                        flex: 1,
                        backgroundColor: '#fff',
                        overflow: 'hidden',
                    }}
                >
                    <ScrollView>
                        <ScrollView horizontal>
                            <GameTimer />
                        </ScrollView>

                        <PlayerListView />
                    </ScrollView>
                    <General
                        config={this.props.config}
                        gameState={this.props.gameState}
                    />
                    <PrivateNewsView events={events}/>
                    <PrivateRoleView roleId={roleId}/>
                    {this.props.bottomView && 
                        <AnimatedOpacity 
                            style={{
                                position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                opacity: this.state.bottomState
                            }}
                            activeOpacity={1}
                            onPress={this.props.toggleBottomView}
                        />
                    }
                </Animated.View>
                
                <BottomView
                    bottomState={this.state.bottomState}
                />
            </View>
        )
    }
}

const styles = {
    container: {
        backgroundColor: '#2a3743',
        flex: 1,
        width: '100%',
    }
}

export default connect(
    state => ({
        config: state.lobby.config,
        gameState: state.lobby.gameState,
        ready: state.game.myReady,
        roleId: state.lobby.myInfo.roleId,
        news: state.game.news,
        events: state.game.events,

        bottomView: state.game.bottomView,
    }),
    {
        toggleBottomView
    }
)(GameView)