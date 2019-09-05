import { combineReducers } from 'redux';
import configReducer from './configReducer';
import scheduleReducer from './scheduleReducer';
import usersReducer from './usersReducer';
import translationsReducer from './translationsReducer';
import libraryReducer from './libraryReducer';
import coursesReducer from './coursesReducer';
import staticInfoReducer from './staticInfoReducers';

export default combineReducers({
    configReducer: configReducer,
    scheduleReducer: scheduleReducer,
    usersReducer: usersReducer,
    translationsReducer: translationsReducer,
    libraryReducer: libraryReducer,
    coursesReducer: coursesReducer,
    staticInfoReducer: staticInfoReducer
});
