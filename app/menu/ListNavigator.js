import BasicMenu from './common/BasicMenuScreen';
import Roles from './common/RoleScreen';
import Menus from './common/MenuScreen';
import InfoPage from './common/InfoPageScreen';

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