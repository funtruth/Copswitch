import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import logger from 'redux-logger'
import storage from 'redux-persist/lib/storage'
import reducers from './reducers';

const persistConfig = {
    key: 'root',
    storage,
}
  
const persistedReducer = persistReducer(persistConfig, reducers)

const store = createStore(
    persistedReducer,
    {},
    applyMiddleware(
        thunk,
        logger
    )
)

const persistor = persistStore(store)

export { store, persistor }