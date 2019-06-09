import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import index from '../reducers/index';

export const mainStore = createStore(index, applyMiddleware(ReduxThunk));
