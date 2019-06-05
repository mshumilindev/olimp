import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import scheduleReducer from '../reducers/scheduleReducers';

export const scheduleStore = createStore(scheduleReducer, applyMiddleware(ReduxThunk));
