import { combineReducers } from 'redux';
import configReducer from './configReducer';
import scheduleReducer from './scheduleReducer';
import usersReducer from './usersReducer';
import translationsReducer from './translationsReducer';

export default combineReducers({
    configReducer: configReducer,
    scheduleReducer: scheduleReducer,
    usersReducer: usersReducer,
    translationsReducer: translationsReducer
});
