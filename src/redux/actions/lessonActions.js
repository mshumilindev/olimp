import { db } from "../../db/firestore";
import { collection, doc, getDocs, onSnapshot, setDoc } from "firebase/firestore"; 

export function fetchLessonMeta(subjectID, courseID, moduleID, lessonID) {
  const lessonRef = doc(db, 'courses', subjectID, 'coursesList', courseID, 'modules', moduleID, 'lessons', lessonID);
  let unsubscribe = null;

  return (dispatch) => {
    dispatch(fetchLessonMetaBegin());
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = onSnapshot(lessonRef, (snapshot) => {
      const lessonMeta = {
        ...snapshot.data(),
        id: snapshot.id,
      };
      dispatch(fetchLessonMetaSuccess(lessonMeta));
    });
  };
}

export function updateLessonMeta(
  subjectID,
  courseID,
  moduleID,
  lessonID,
  newMeta,
) {
  const lessonRef = doc(db, 'courses', subjectID, 'coursesList', courseID, 'modules', moduleID, 'lessons', lessonID);

  return (dispatch) => {
    dispatch(fetchLessonMetaBegin());
    return setDoc(
      lessonRef,
      {
        ...newMeta,
      },
      { merge: true },
    );
  };
}

export const FETCH_LESSON_META_BEGIN = "FETCH_LESSON_META_BEGIN";
export const FETCH_LESSON_META_SUCCESS = "FETCH_LESSON_META_SUCCESS";

export const fetchLessonMetaBegin = () => {
  return {
    type: FETCH_LESSON_META_BEGIN,
  };
};

export const fetchLessonMetaSuccess = (lessonMeta) => {
  return {
    type: FETCH_LESSON_META_SUCCESS,
    payload: { lessonMeta },
  };
};

export function fetchLessonContent(subjectID, courseID, moduleID, lessonID) {
  const lessonContentRef = collection(db, 'courses', subjectID, 'coursesList', courseID, 'modules', moduleID, 'lessons', lessonID, 'content');
  let unsubscribe = null;

  return (dispatch) => {
    dispatch(fetchLessonContentBegin());
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = onSnapshot(lessonContentRef, (snapshot) => {
      const lessonContent = [];

      if (snapshot.docs.length) {
        snapshot.docs.forEach((item) =>
          lessonContent.push({
            ...item.data(),
            id: item.id,
          }),
        );
      }
      dispatch(fetchLessonContentSuccess(lessonContent));
    });
  };
}

export function updateLessonContent(
  subjectID,
  courseID,
  moduleID,
  lessonID,
  newContent,
) {
  const lessonContentRef = collection(db, 'courses', subjectID, 'coursesList', courseID, 'modules', moduleID, 'lessons', lessonID, 'content');

  return (dispatch) => {
    dispatch(fetchLessonContentBegin());
    getDocs(lessonContentRef).then((snapshot) => {
      const toDelete = snapshot.docs.filter(
        (doc) => !newContent.find((item) => item.id === doc.id),
      );
      const toUpdate = snapshot.docs.filter((doc) =>
        newContent.find((item) => item.id === doc.id),
      );
      const toCreate = newContent.filter(
        (item) => !snapshot.docs.find((doc) => doc.id === item.id),
      );

      if (toDelete.length) {
        toDelete.forEach((doc) => {
          doc.ref.delete();
        });
      }

      if (toUpdate.length) {
        toUpdate.forEach((doc) => {
          doc.ref.set(
            {
              ...newContent.find((item) => item.id === doc.id),
            },
            { merge: true },
          );
        });
      }

      if (toCreate.length) {
        toCreate.forEach((item) => {
          const newContentItem = lessonContentRef.doc(item.id);

          newContentItem.set(item);
        });
      }
    });
  };
}

export const FETCH_LESSON_CONTENT_BEGIN = "FETCH_LESSON_CONTENT_BEGIN";
export const FETCH_LESSON_CONTENT_SUCCESS = "FETCH_LESSON_CONTENT_SUCCESS";

export const fetchLessonContentBegin = () => {
  return {
    type: FETCH_LESSON_CONTENT_BEGIN,
  };
};

export const fetchLessonContentSuccess = (lessonContent) => {
  return {
    type: FETCH_LESSON_CONTENT_SUCCESS,
    payload: { lessonContent },
  };
};

export function fetchLessonQA(subjectID, courseID, moduleID, lessonID) {
  const lessonQARef = collection(db, 'courses', subjectID, 'coursesList', courseID, 'modules', moduleID, 'lessons', lessonID, 'QA');
  let unsubscribe = null;

  return (dispatch) => {
    dispatch(fetchLessonQABegin());
    if (unsubscribe) {
      unsubscribe();
    }
    unsubscribe = onSnapshot(lessonQARef, (snapshot) => {
      const lessonQA = [];

      if (snapshot.docs.length) {
        snapshot.docs.forEach((item) =>
          lessonQA.push({
            ...item.data(),
            id: item.id,
          }),
        );
      }
      dispatch(fetchLessonQASuccess(lessonQA));
    });
  };
}

export function updateLessonQA(subjectID, courseID, moduleID, lessonID, newQA) {
  const lessonQARef = collection(db, 'courses', subjectID, 'coursesList', courseID, 'modules', moduleID, 'lessons', lessonID, 'QA');

  return (dispatch) => {
    dispatch(fetchLessonQABegin());
    getDocs(lessonQARef).then((snapshot) => {
      const toDelete = snapshot.docs.filter(
        (doc) => !newQA.find((item) => item.id === doc.id),
      );
      const toUpdate = snapshot.docs.filter((doc) =>
        newQA.find((item) => item.id === doc.id),
      );
      const toCreate = newQA.filter(
        (item) => !snapshot.docs.find((doc) => doc.id === item.id),
      );

      if (toDelete.length) {
        toDelete.forEach((doc) => {
          doc.ref.delete();
        });
      }

      if (toUpdate.length) {
        toUpdate.forEach((doc) => {
          doc.ref.set(
            {
              ...newQA.find((item) => item.id === doc.id),
            },
            { merge: true },
          );
        });
      }

      if (toCreate.length) {
        toCreate.forEach((item) => {
          const newContentItem = lessonQARef.doc(item.id);

          newContentItem.set(item);
        });
      }
    });
  };
}

export const FETCH_LESSON_QA_BEGIN = "FETCH_LESSON_QA_BEGIN";
export const FETCH_LESSON_QA_SUCCESS = "FETCH_LESSON_QA_SUCCESS";

export const fetchLessonQABegin = () => {
  return {
    type: FETCH_LESSON_QA_BEGIN,
  };
};

export const fetchLessonQASuccess = (lessonQA) => {
  return {
    type: FETCH_LESSON_QA_SUCCESS,
    payload: { lessonQA },
  };
};
