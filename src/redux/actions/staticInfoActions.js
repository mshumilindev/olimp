import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore"; 
import { db } from "../../db/firestore";

const staticInfoCollection = collection(db, 'staticInfo');
const newStaticInfoList = [];

export function fetchStaticInfo() {
  if (!newStaticInfoList.length) {
    return (dispatch) => {
      dispatch(staticInfoBegin());
      return getDocs(staticInfoCollection).then((data) => {
        data.docs.map((doc) => {
          return newStaticInfoList.push({
            ...doc.data(),
            id: doc.id,
          });
        });

        dispatch(staticInfoSuccess(newStaticInfoList));
      });
    };
  } else {
    return (dispatch) => {
      dispatch(staticInfoSuccess(newStaticInfoList));
    };
  }
}

export function fetchPage(slug) {
  const docRef = query(collection(db, 'staticInfo'), where('slug', '==', slug));
  let page = null;

  return (dispatch) => {
    dispatch(pageBegin());
    return getDocs(docRef).then((snapshot) => {
      if (snapshot.docs.length) {
        const doc = snapshot.docs[0];
        const contentRef = collection(db, 'staticInfo', doc.id, 'content');

        page = {
          ...doc.data(),
          id: doc.id,
        };

        getDocs(contentRef).then((content) => {
          const blocks = [];
          if (content.docs.length) {
            content.docs.forEach((item) => {
              blocks.push({
                ...item.data(),
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

export function removePage(pageID) {
  const pageRef = doc(db, 'staticInfo', pageID);

  return (dispatch) => {
    dispatch(staticInfoBegin());
    return deleteDoc(pageRef).then(() => {
      return getDocs(staticInfoCollection).then((data) => {
        newStaticInfoList.splice(0, newStaticInfoList.length);
        data.docs.map((doc) =>
          newStaticInfoList.push({
            ...doc.data(),
            id: doc.id,
          }),
        );
        dispatch(staticInfoSuccess(newStaticInfoList));
      });
    });
  };
}

export function createPage(pageID, page) {
  const pageRef = doc(db, 'staticInfo', pageID);
  delete page.id;
  delete page.content;

  return (dispatch) => {
    dispatch(staticInfoBegin());
    return setDoc(pageRef, {
        ...page,
      })
      .then(() => {
        return getDocs(staticInfoCollection).then((data) => {
          newStaticInfoList.splice(0, newStaticInfoList.length);
          data.docs.map((doc) => {
            return newStaticInfoList.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          dispatch(staticInfoSuccess(newStaticInfoList));
        });
      });
  };
}

export function updatePage(pageID, page) {
  const pageRef = doc(db, 'staticInfo', pageID);
  const slug = page.slug;
  const contentRef = collection(db, 'staticInfo', pageID, 'content');
  const content = page.content;
  let toDeleteI = 0;
  let toCreateI = 0;

  delete page.id;
  delete page.content;

  const handleContent = (dispatch) => {
    getDocs(contentRef).then((snapshot) => {
      if (snapshot.docs.length) {
        deleteDoc(snapshot, dispatch);
      } else {
        if (content && content.length) {
          createDoc(dispatch);
        } else {
          return redoList(dispatch);
        }
      }
    });
  };

  const deleteDoc = (snapshot, dispatch) => {
    const docRef = collection(db, "staticInfo")
      .doc(pageID)
      .collection("content")
      .doc(snapshot.docs[toDeleteI].id);
    docRef.delete().then(() => {
      toDeleteI++;
      if (toDeleteI < snapshot.docs.length) {
        deleteDoc(snapshot, dispatch);
      } else {
        if (content && content.length) {
          createDoc(dispatch);
        } else {
          return redoList(dispatch);
        }
      }
    });
  };

  const createDoc = (dispatch) => {
    const block = content[toCreateI];
    const docRef = doc(db, 'staticInfo', pageID, 'content', block.id);

    setDoc(docRef, {
        ...block,
        order: toCreateI,
      })
      .then(() => {
        toCreateI++;
        if (toCreateI < content.length) {
          createDoc(dispatch);
        } else {
          return redoList(dispatch);
        }
      });
  };

  const redoList = (dispatch) => {
    const docRef = query(collection(db, 'staticInfo'), where('slug', '==', slug));
    let page = null;

    return getDocs(docRef).then((snapshot) => {
      const doc = snapshot.docs[0];
      const contentRef = collection(db, 'staticInfo', doc.id, 'content');

      page = {
        ...doc.data(),
        id: doc.id,
      };

      getDocs(contentRef).then((content) => {
        const blocks = [];
        if (content.docs.length) {
          content.docs.forEach((item) => {
            blocks.push({
              ...item.data(),
            });
          });
        }
        blocks.sort((a, b) => a.order - b.order);
        page.content = blocks;
        return getDocs(staticInfoCollection).then((data) => {
          newStaticInfoList.splice(0, newStaticInfoList.length);
          data.docs.map((doc) => {
            return newStaticInfoList.push({
              ...doc.data(),
              id: doc.id,
            });
          });

          dispatch(staticInfoSuccess(newStaticInfoList));
          dispatch(pageSuccess(page));
        });
      });
    });
  };

  return (dispatch) => {
    dispatch(pageBegin());
    return setDoc(pageRef, {
        ...page,
      })
      .then(() => {
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
export const staticInfoSuccess = (staticInfo) => {
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
export const pageSuccess = (page) => {
  return {
    type: PAGE_SUCCESS,
    payload: { page },
  };
};
