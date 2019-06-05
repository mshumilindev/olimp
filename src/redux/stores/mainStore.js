import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import mainReducer from '../reducers/mainReducers';

export const mainStore = createStore(mainReducer, applyMiddleware(ReduxThunk));
