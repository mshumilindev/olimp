/* global onTranslationsUpdate */

import { IUpdate } from "@types";
import { doc, setDoc } from "firebase/firestore";
import { Dispatch } from "redux";
import { db } from "../../db/firestore";

const translationsRef = doc(db, "updates", "translations");
const siteSettingsRef = doc(db, "updates", "siteSettings");
const versionRef = doc(db, "updates", "version");

export function setUpdates(type: IUpdate) {
  const date = new Date();
  return (dispatch: Dispatch) => {
    dispatch(updatesBegin());

    if (type === "translations") {
      return setDoc(translationsRef, {
        date: date.getTime(),
      }).then(() => {
        // @ts-ignore
        window.dispatchEvent(onTranslationsUpdate);
        dispatch(updatesSuccess());
      });
    }
    if (type === "siteSettings") {
      return setDoc(siteSettingsRef, {
        date: date.getTime(),
      }).then(() => {
        dispatch(updatesSuccess());
      });
    }
    if (type === "version") {
      return setDoc(versionRef, {
        date: date.getTime(),
      }).then(() => {
        dispatch(updatesSuccess());
      });
    }
  };
}

export const UPDATES_BEGIN = "UPDATES_BEGIN";
export const UPDATES_SUCCESS = "UPDATES_SUCCESS";

export const updatesBegin = () => {
  return {
    type: UPDATES_BEGIN,
  };
};
export const updatesSuccess = () => {
  return {
    type: UPDATES_SUCCESS,
  };
};
