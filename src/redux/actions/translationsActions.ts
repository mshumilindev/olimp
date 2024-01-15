import { ITranslation } from "@types";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { Dispatch } from "redux";
import { db } from "../../db/firestore";

const translationsCollection = collection(db, "translations");
const translationsList = localStorage.getItem("translationsList")
  ? JSON.parse(localStorage.getItem("translationsList") || '')
  : [];

export const fetchTranslations = () => {
  if (!translationsList.length) {
    return (dispatch: Dispatch) => {
      dispatch(fetchTranslationsBegin());

      return getDocs(translationsCollection).then((data) => {
        Object.keys(data.docs[0].data()).forEach((itemKey) => {
          translationsList.push({
            id: itemKey,
            langs: [],
          });
          data.docs.forEach((lang) => {
            const translationsListItem = translationsList.find(
              (item: ITranslation) => item.id === itemKey,
            );

            if (translationsListItem) {
              translationsListItem.langs.push({
                [lang.id]: data.docs.find((doc) => doc.id === lang.id)?.data()[
                  itemKey
                ],
              });
            }
          });
        });
        localStorage.setItem(
          "translationsList",
          JSON.stringify(translationsList),
        );
        dispatch(fetchTranslationsSuccess(translationsList));
      });
    };
  } else {
    return (dispatch: Dispatch) => {
      dispatch(fetchTranslationsSuccess(translationsList));
    };
  }
}

export const updateTranslation = (id: string, key: string, value: string) => {
  const translationDoc = doc(db, "translations", id);

  return (dispatch: Dispatch) => {
    dispatch(updateTranslationBegin());
    return updateDoc(translationDoc, {
      [key]: value,
    }).then(() => {
      return getDocs(translationsCollection).then((data) => {
        translationsList.length = 0;
        Object.keys(data.docs[0].data()).forEach((itemKey) => {
          translationsList.push({
            id: itemKey,
            langs: [],
          });
          data.docs.forEach((lang) => {
            const translationsListItem = translationsList.find(
              (item: ITranslation) => item.id === itemKey,
            );

            if (translationsListItem) {
              translationsListItem.langs.push({
                [lang.id]: data.docs.find((doc) => doc.id === lang.id)?.data()[
                  itemKey
                ],
              });
            }
          });
        });
        dispatch(updateTranslationSuccess(translationsList));
      });
    });
  };
}

export const FETCH_TRANSLATIONS_BEGIN = "FETCH_TRANSLATIONS_BEGIN";
export const FETCH_TRANSLATIONS_SUCCESS = "FETCH_TRANSLATIONS_SUCCESS";

export const fetchTranslationsBegin = () => {
  return {
    type: FETCH_TRANSLATIONS_BEGIN,
  };
};
export const fetchTranslationsSuccess = (translationsList: ITranslation[]) => {
  return {
    type: FETCH_TRANSLATIONS_SUCCESS,
    payload: { translationsList },
  };
};

export const UPDATE_TRANSLATION_BEGIN = "UPDATE_TRANSLATION_BEGIN";
export const UPDATE_TRANSLATION_SUCCESS = "UPDATE_TRANSLATION_SUCCESS";

export const updateTranslationBegin = () => {
  return {
    type: UPDATE_TRANSLATION_BEGIN,
  };
};
export const updateTranslationSuccess = (translationsList: ITranslation[]) => {
  return {
    type: UPDATE_TRANSLATION_SUCCESS,
    payload: { translationsList },
  };
};
