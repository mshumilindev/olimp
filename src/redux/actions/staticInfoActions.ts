import { TBlock, TEmptyPage, TPage } from "@types";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  QuerySnapshot,
  setDoc,
  where,
} from "firebase/firestore";
import { Dispatch } from "redux";
import { db } from "../../db/firestore";

const staticInfoCollection = collection(db, 'staticInfo');
const newStaticInfoList: TPage[] = [];

export const fetchStaticInfo = () => {
  console.log(newStaticInfoList)
  if (!newStaticInfoList.length) {
    return (dispatch: Dispatch) => {
      dispatch(staticInfoBegin());
      return getDocs(staticInfoCollection).then((data) => {
        data.docs.map((doc) => {
          return newStaticInfoList.push({
            ...doc.data() as Omit<TPage, 'id'>,
            id: doc.id,
          });
        });

        dispatch(staticInfoSuccess(newStaticInfoList));
      });
    };
  } else {
    return (dispatch: Dispatch) => {
      dispatch(staticInfoSuccess(newStaticInfoList));
    };
  }
}

export const fetchPage = (slug: string) => {
  const docRef = query(collection(db, "staticInfo"), where("slug", "==", slug));
  let page: TPage | TEmptyPage = {
    id: '',
    content: []
  };

  return (dispatch: Dispatch) => {
    dispatch(pageBegin());
    return getDocs(docRef).then((snapshot) => {
      if (snapshot.docs.length) {
        const doc = snapshot.docs[0];
        const contentRef = collection(db, "staticInfo", doc.id, "content");

        page = {
          ...doc.data(),
          id: doc.id,
        } as TPage;

        getDocs(contentRef).then((content) => {
          const blocks: TBlock[] = [];
          if (content.docs.length) {
            content.docs.forEach((item) => {
              blocks.push({
                ...item.data() as TBlock,
              });
            });
          }
          blocks.sort((a, b) => a.order - b.order);
          page.content = blocks;
          dispatch(pageSuccess(page));
        });
      } else {
        dispatch(pageSuccess(page));
      }
    });
  };
}

export const removePage = (pageID: string) => {
  const pageRef = doc(db, "staticInfo", pageID);

  return (dispatch: Dispatch) => {
    dispatch(staticInfoBegin());
    return deleteDoc(pageRef).then(() => {
      return getDocs(staticInfoCollection).then((data) => {
        newStaticInfoList.splice(0, newStaticInfoList.length);
        data.docs.map((doc) =>
          newStaticInfoList.push({
            ...doc.data() as Omit<TPage, 'id'>,
            id: doc.id,
          }),
        );
        dispatch(staticInfoSuccess(newStaticInfoList));
      });
    });
  };
}

export const createPage = (pageID: string, page: TPage) => {
  const pageRef = doc(db, "staticInfo", pageID);
  delete page.id;
  delete page.content;

  return (dispatch: Dispatch) => {
    dispatch(staticInfoBegin());
    return setDoc(pageRef, {
      ...page,
    }).then(() => {
      return getDocs(staticInfoCollection).then((data) => {
        newStaticInfoList.splice(0, newStaticInfoList.length);
        data.docs.map((doc) => {
          return newStaticInfoList.push({
            ...doc.data() as Omit<TPage, 'id'>,
            id: doc.id,
          });
        });
        dispatch(staticInfoSuccess(newStaticInfoList));
      });
    });
  };
}

export const updatePage = (pageID: string, page: TPage) => {
  const pageRef = doc(db, "staticInfo", pageID);
  const slug = page.slug;
  const contentRef = collection(db, "staticInfo", pageID, "content");
  const content = page.content;
  let toDeleteI = 0;
  let toCreateI = 0;

  delete page.id;
  delete page.content;

  const handleContent = (dispatch: Dispatch) => {
    getDocs(contentRef).then((snapshot) => {
      if (snapshot.docs.length) {
        deleteDocument(snapshot, dispatch);
      } else {
        if (content && content.length) {
          createDoc(dispatch);
        } else {
          return redoList(dispatch);
        }
      }
    });
  };

  const deleteDocument = (snapshot: QuerySnapshot, dispatch: Dispatch) => {
    const docRef = doc(db, 'staticInfo', pageID, 'content', snapshot.docs[toDeleteI].id);
    deleteDoc(docRef).then(() => {
      toDeleteI++;
      if (toDeleteI < snapshot.docs.length) {
        deleteDocument(snapshot, dispatch);
      } else {
        if (content && content.length) {
          createDoc(dispatch);
        } else {
          return redoList(dispatch);
        }
      }
    });
  };

  const createDoc = (dispatch: Dispatch) => {
    const block = content?.[toCreateI];
    const docRef = doc(db, "staticInfo", pageID, "content", block?.id || '');

    setDoc(docRef, {
      ...block,
      order: toCreateI,
    }).then(() => {
      toCreateI++;
      if (toCreateI < (content?.length || 0)) {
        createDoc(dispatch);
      } else {
        return redoList(dispatch);
      }
    });
  };

  const redoList = (dispatch: Dispatch) => {
    const docRef = query(
      collection(db, "staticInfo"),
      where("slug", "==", slug),
    );
    let page: TPage | TEmptyPage = {
      id: '',
      content: []
    };

    return getDocs(docRef).then((snapshot) => {
      const doc = snapshot.docs[0];
      const contentRef = collection(db, "staticInfo", doc.id, "content");

      page = {
        ...doc.data(),
        id: doc.id,
      } as TPage;

      getDocs(contentRef).then((content) => {
        const blocks: TBlock[] = [];
        if (content.docs.length) {
          content.docs.forEach((item) => {
            blocks.push({
              ...item.data() as TBlock,
            });
          });
        }
        blocks.sort((a, b) => a.order - b.order);
        page.content = blocks;
        return getDocs(staticInfoCollection).then((data) => {
          newStaticInfoList.splice(0, newStaticInfoList.length);
          data.docs.map((doc) => {
            return newStaticInfoList.push({
              ...doc.data() as Omit<TPage, 'id'>,
              id: doc.id,
            });
          });

          dispatch(staticInfoSuccess(newStaticInfoList));
          dispatch(pageSuccess(page));
        });
      });
    });
  };

  return (dispatch: Dispatch) => {
    dispatch(pageBegin());
    return setDoc(pageRef, {
      ...page,
    }).then(() => {
      handleContent(dispatch);
    });
  };
}

export const STATIC_INFO_BEGIN = "STATIC_INFO_BEGIN";
export const STATIC_INFO_SUCCESS = "STATIC_INFO_SUCCESS";
export const PAGE_BEGIN = "PAGE_BEGIN";
export const PAGE_SUCCESS = "PAGE_SUCCESS";

export const staticInfoBegin = () => {
  return {
    type: STATIC_INFO_BEGIN,
  };
};
export const staticInfoSuccess = (staticInfo: TPage[]) => {
  return {
    type: STATIC_INFO_SUCCESS,
    payload: { staticInfo },
  };
};
export const pageBegin = () => {
  return {
    type: PAGE_BEGIN,
  };
};
export const pageSuccess = (page: TPage | TEmptyPage) => {
  return {
    type: PAGE_SUCCESS,
    payload: { page },
  };
};
