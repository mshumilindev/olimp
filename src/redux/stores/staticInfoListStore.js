import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import staticInfoReducer from '../reducers/staticInfoReducers';

export const staticInfoListStore = createStore(staticInfoReducer, applyMiddleware(ReduxThunk));
