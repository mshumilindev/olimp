import firebase from "../../db/firestore";

const db = firebase.firestore();
const siteSettingsCollection = db.collection('config');
const siteSettingsList = localStorage.getItem('siteSettings') ? JSON.parse(localStorage.getItem('siteSettings')).data : {data: {}};

export function fetchSiteSettings() {
    if ( !Object.keys(siteSettingsList.data).length ) {
        return dispatch => {
            dispatch(siteSettingsBegin());
            return siteSettingsCollection.get().then((data) => {
                siteSettingsList.data = {};
                data.docs.map(doc => siteSettingsList.data[doc.id] = doc.data());
                localStorage.setItem('siteSettings', JSON.stringify({data: siteSettingsList}));

                dispatch(siteSettingsSuccess(siteSettingsList.data));
            });
        }
    }
    else {
        return dispatch => {
            dispatch(siteSettingsSuccess(siteSettingsList.data))
        }
    }
}

export function updateSiteSettings(newSiteSettings) {
    const logoRef = db.collection('config').doc('logo');
    const siteNameRef = db.collection('config').doc('siteName');

    return dispatch => {
        dispatch(siteSettingsBegin());
        return logoRef.set({
            ...newSiteSettings.logo
        }).then(() => {
            siteNameRef.set({
                ...newSiteSettings.siteName
            }).then(() => {
                return siteSettingsCollection.get().then((data) => {
                    siteSettingsList.data = {};
                    data.docs.map(doc => siteSettingsList.data[doc.id] = doc.data());
                    localStorage.setItem('siteSettings', JSON.stringify({data: siteSettingsList}));

                    dispatch(siteSettingsSuccess(siteSettingsList.data));
                });
            });
        });
    }
}

export const SITE_SETTINGS_BEGIN = 'SITE_SETTINGS_BEGIN';
export const SITE_SETTINGS_SUCCESS = 'SITE_SETTINGS_SUCCESS';

export const siteSettingsBegin =() => {
    return {
        type: SITE_SETTINGS_BEGIN
    }
};
export const siteSettingsSuccess = siteSettingsList => {
    return {
        type: SITE_SETTINGS_SUCCESS,
        payload: { siteSettingsList }
    }
};
