import {gameViewType} from './types'

import Game from '../lobby/screen/Game'
import Roles from '../lobby/screen/Roles'
import Lobby from '../lobby/screen/Lobby'

import News from '../game/screen/News'
import GameChoice from '../game/screen/GameChoice'
import Events from '../game/screen/Events'
import LobbyList from '../game/screen/Lobby'
import Waiting from '../game/components/Waiting';

export const LobbyTabs = [
    {
        label: 'Roles',
        icon: 'ios-grid',
        key: 'roles',
        Component: Roles,
    },
    {
        label: 'Game',
        icon: 'ios-flash',
        key: 'game',
        Component: Game,
    },
    {
        label: 'Players',
        icon: 'ios-people',
        key: 'lobby',
        Component: Lobby,
    },
]

export const GameTabs = [
    {
        label: 'News',
        icon: 'ios-megaphone',
        key: gameViewType.news,
        Component: News
    },
    {
        label: 'Game',
        icon: 'ios-home',
        key: gameViewType.game,
        Component: GameChoice,
    },
    {
        label: 'Events',
        icon: 'ios-paper-plane',
        key: gameViewType.events,
        Component: Events,
    },
    {
        key: gameViewType.lobby,
        Component: LobbyList,
    },
    {
        key: gameViewType.waiting,
        Component: Waiting
    }
]

export const Constants = {
    headerHeight: 80,
    footerHeight: 80,
    modalHeaderHeight: 35,
}