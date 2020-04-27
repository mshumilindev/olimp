import { combineReducers } from 'redux';
import configReducer from './configReducer';
import scheduleReducer from './scheduleReducer';
import usersReducer from './usersReducer';
import translationsReducer from './translationsReducer';
import libraryReducer from './libraryReducer';
import coursesReducer from './coursesReducer';
import staticInfoReducer from './staticInfoReducers';
import classesReducer from './classesReducer';
import contactReducer from './contactReducers';
import siteSettingsReducer from './siteSettingsReducer';
import notificationsReducer from './notificationsReducer';
import eventsReducer from './eventsReducer';
import testsReducer from "./testsReducer";
import authReducer from "./authReducer";

export default combineReducers({
    configReducer: configReducer,
    scheduleReducer: scheduleReducer,
    usersReducer: usersReducer,
    translationsReducer: translationsReducer,
    libraryReducer: libraryReducer,
    coursesReducer: coursesReducer,
    staticInfoReducer: staticInfoReducer,
    classesReducer: classesReducer,
    contactReducer: contactReducer,
    siteSettingsReducer: siteSettingsReducer,
    notificationsReducer: notificationsReducer,
    eventsReducer: eventsReducer,
    testsReducer: testsReducer,
    authReducer: authReducer
});
