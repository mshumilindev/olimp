import { combineReducers } from 'redux';
import configReducer from './configReducer';
import scheduleReducer from './scheduleReducer';

export default combineReducers({
    configReducer: configReducer,
    scheduleReducer: scheduleReducer
});
