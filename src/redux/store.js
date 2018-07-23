import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import logger from 'redux-logger'
import storage from 'redux-persist/lib/storage'
import reducers from './reducers';

const persistConfig = {
    timeout: 10000,
    key: 'root',
    storage,
    whitelist: ['profile', 'loading']
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