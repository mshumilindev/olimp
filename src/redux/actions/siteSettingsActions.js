import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../db/firestore";

const siteSettingsCollection = collection(db, "config");
let siteSettingsList = null;

export function fetchSiteSettings() {
  siteSettingsList = localStorage.getItem("siteSettings")
    ? JSON.parse(localStorage.getItem("siteSettings")).data
    : { data: {} };
  if (!Object.keys(siteSettingsList.data).length) {
    return (dispatch) => {
      dispatch(siteSettingsBegin());
      return getDocs(siteSettingsCollection).then((data) => {
        siteSettingsList.data = {};
        data.docs.map((doc) => (siteSettingsList.data[doc.id] = doc.data()));
        localStorage.setItem(
          "siteSettings",
          JSON.stringify({ data: siteSettingsList }),
        );

        dispatch(siteSettingsSuccess(siteSettingsList.data));
      });
    };
  } else {
    return (dispatch) => {
      dispatch(siteSettingsSuccess(siteSettingsList.data));
    };
  }
}

export function updateSiteSettings(newSiteSettings) {
  const logoRef = doc(db, "config", "logo");
  const siteNameRef = doc(db, "config", "siteName");
  const addressRef = doc(db, "config", "address");

  return (dispatch) => {
    dispatch(siteSettingsBegin());
    return setDoc(logoRef, {
      ...newSiteSettings.logo,
    }).then(() => {
      setDoc(siteNameRef, {
        ...newSiteSettings.siteName,
      }).then(() => {
        setDoc(addressRef, {
          ...newSiteSettings.address,
        }).then(() => {
          return getDocs(siteSettingsCollection).then((data) => {
            siteSettingsList.data = {};
            data.docs.map(
              (doc) => (siteSettingsList.data[doc.id] = doc.data()),
            );
            localStorage.setItem(
              "siteSettings",
              JSON.stringify({ data: siteSettingsList }),
            );

            dispatch(siteSettingsSuccess(siteSettingsList.data));
          });
        });
      });
    });
  };
}

export const SITE_SETTINGS_BEGIN = "SITE_SETTINGS_BEGIN";
export const SITE_SETTINGS_SUCCESS = "SITE_SETTINGS_SUCCESS";

export const siteSettingsBegin = () => {
  return {
    type: SITE_SETTINGS_BEGIN,
  };
};
export const siteSettingsSuccess = (siteSettingsList) => {
  return {
    type: SITE_SETTINGS_SUCCESS,
    payload: { siteSettingsList },
  };
};
