import { NavigationActions } from 'react-navigation'

let _container;

function setContainer(container){
    _container = container
}

function reset(routeName){
    _container.dispatch(
        NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    type: 'Navigation/NAVIGATE',
                    routeName
                })
            ]
        })
    )
}

function back(){
    _container.dispatch(
        NavigationActions.back()
    )
}

function navigate(routeName){
    _container.dispatch(
        NavigationActions.navigate({
            type: 'Navigation/NAVIGATE',
            routeName
        }),
    );
}
  
function getCurrentRoute(){
    if (!_container || !_container.state.nav) {
        return null;
    }

    return _container.state.nav.routes[_container.state.nav.index] || null;
}
  
export default {
    setContainer,
    navigate,
    reset,
    back,
    getCurrentRoute,
};