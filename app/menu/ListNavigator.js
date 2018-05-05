import BasicMenu from './BasicMenuScreen';
import Roles from './RoleScreen';
import Menus from './MenuScreen';
import InfoPage from './InfoPageScreen';

import { StackNavigator } from 'react-navigation';

const Menu = StackNavigator(
    {
        BasicMenu: {
            screen: BasicMenu,
        },
        Roles: {
            screen: Roles,
        },
        Menus: {
            screen: Menus,
        },
        InfoPage: {
            screen: InfoPage,
        },
    },
    {
        initialRouteName: 'BasicMenu',
        headerMode: 'none',
        cardStyle: {backgroundColor: 'transparent', justifyContent:'center'}
    }
);

export default Menu