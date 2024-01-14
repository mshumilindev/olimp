import React, {
  useContext,
  useState,
  useEffect,
  memo,
  useMemo,
  useCallback,
} from "react";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { orderBy } from "natural-orderby";
import { compose } from "redux";
import styled, { keyframes } from "styled-components";

import siteSettingsContext from "../../../context/siteSettingsContext";
import AdminCoursesCourse from "../AdminCoursesCourse/AdminCoursesCourse";
import {
  deleteSubject,
  fetchCoursesList,
  deleteCourse,
} from "../../../redux/actions/coursesActions";
import UpdateSubject from "../AdminCoursesActions/UpdateSubject";
import UpdateCourse from "../AdminCoursesActions/UpdateCourse";
import AdminCoursesCourseSidebar from "../AdminCoursesCourseSidebar";
import UpdateModule from "../AdminCoursesActions/UpdateModule";
import Confirm from "../../UI/Confirm/Confirm";
import ContextMenu from "../../UI/ContextMenu/ContextMenu";

const AdminCoursesSubject = ({
  user,
  loading,
  subject,
  deleteSubject,
  isLessonCoppied,
  setIsLessonCoppied,
  fetchCoursesList,
  subjectCoursesList,
  subjectCoursesListLoading,
  subjectIDRef,
  coursesQty = 0,
}) => {
  const params = useParams();
  const { lang, translate } = useContext(siteSettingsContext);
  const [showUpdateSubject, setShowUpdateSubject] = useState(false);
  const [showUpdateCourse, setShowUpdateCourse] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUpdateModule, setShowUpdateModule] = useState(false);
  const contextLinks = [
    {
      name: translate("create_course"),
      icon: "fa fa-plus",
      action: handleShowCourseUpdate,
      id: 0,
    },
    {
      type: "divider",
      id: 1,
    },
    {
      name: translate("edit_subject"),
      icon: "fa fa-pencil-alt",
      action: () => setShowUpdateSubject(true),
      id: 2,
    },
    {
      name: translate("delete_subject"),
      icon: "fa fa-trash-alt",
      type: "error",
      action: onDeleteSubject,
      id: 3,
    },
  ];

  useEffect(() => {
    const isCurrentSubjectOpen =
      !!params?.subjectID && params.subjectID === subject?.id;

    if (
      subjectIDRef?.current !== params?.subjectID &&
      ((isCurrentSubjectOpen && !params?.courseID) ||
        (isCurrentSubjectOpen && !subjectCoursesList))
    ) {
      fetchCoursesList(params.subjectID, null, !subject.children);
      subjectIDRef.current = params.subjectID;
    }
  }, [fetchCoursesList, params, subject, subjectIDRef]);

  const isSubjectOpen = useMemo(() => {
    return params?.subjectID === subject?.id;
  }, [params, subject]);

  const isCourseOpen = useMemo(() => {
    return params?.subjectID === subject?.id && params?.courseID;
  }, [params, subject]);

  const sortedCoursesList = useMemo(() => {
    const arr = subjectCoursesList?.filter((item) =>
      user.role === "teacher" ? item.teacher === user?.id : true,
    );

    return orderBy(arr, [(v) => (v.name[lang] ? v.name[lang] : v.name["ua"])]);
  }, [subjectCoursesList]);

  const selectedCourse = useMemo(() => {
    return sortedCoursesList.find((item) => item.id === params?.courseID);
  }, [sortedCoursesList, params]);

  const subjectLink = useMemo(() => {
    let link = "/admin-courses";

    if (!params?.subjectID || params.subjectID !== subject?.id) {
      link += `/${subject?.id}`;
    }
    return link;
  }, [params, subject]);

  useEffect(() => {
    if (isSubjectOpen && !subjectCoursesListLoading) {
      const subjectEl = document.querySelector("#scrollHere");

      if (subjectEl) {
        setTimeout(() => {
          const scrollTop = window.scrollY;
          const top = scrollTop + subjectEl.getBoundingClientRect().top - 277;

          window.scrollTo({ top: top });
        }, 0);
      }
    }
  }, [isSubjectOpen, subjectCoursesListLoading]);

  const handleDeleteSubject = useCallback(() => {
    setShowConfirm(false);
    deleteSubject(subject.id);
  }, [deleteSubject]);

  return (
    <AdminCoursesSubjectStyled id={isSubjectOpen ? "scrollHere" : null}>
      <ContextMenu links={contextLinks}>
        <SubjectLinkStyled
          to={subjectLink}
          isOpen={isSubjectOpen}
          isSubjectSelected={params?.subjectID}
        >
          <span>
            {checkIfIsOpen() ? (
              loading ? (
                <SubjectIcon className="fas fa-spinner" />
              ) : (
                <SubjectIcon className="fa fa-folder-open" />
              )
            ) : (
              <SubjectIcon className="fa fa-folder" />
            )}
            {subject.name[lang] ? subject.name[lang] : subject.name["ua"]}
          </span>
          <AdminCoursesListItemCoursesStyled isEmpty={!coursesQty}>
            Кількість предметів: {coursesQty}
          </AdminCoursesListItemCoursesStyled>
        </SubjectLinkStyled>
      </ContextMenu>
      {isSubjectOpen && (
        <AdminCoursesLayoutStyled>
          {subjectCoursesListLoading ? (
            <AdminCoursesCoursesListStyled>
              {!!coursesQty ? (
                [...Array(coursesQty)].map(() => (
                  <AdminCoursesSkeletonStyled>
                    <AdminCoursesSkeletonInnerStyled>
                      <AdminCoursesSkeletonIconStyled />
                      <AdminCoursesSkeletonTextStyled />
                    </AdminCoursesSkeletonInnerStyled>
                  </AdminCoursesSkeletonStyled>
                ))
              ) : (
                <AdminCoursesNothingFound>
                  <i className="fa fa-unlink" />
                  {translate("no_courses")}
                </AdminCoursesNothingFound>
              )}
            </AdminCoursesCoursesListStyled>
          ) : !!sortedCoursesList?.length ? (
            <AdminCoursesCoursesListStyled>
              {sortedCoursesList.map((item) => (
                <AdminCoursesCourse
                  subjectID={subject.id}
                  course={item}
                  key={item.id}
                  params={params}
                  loading={loading}
                  isLessonCoppied={isLessonCoppied}
                  setIsLessonCoppied={setIsLessonCoppied}
                  showUpdateModule={showUpdateModule}
                  setShowUpdateModule={setShowUpdateModule}
                  handleCreateModule={handleCreateModule}
                />
              ))}
            </AdminCoursesCoursesListStyled>
          ) : (
            <AdminCoursesNothingFound>
              <i className="fa fa-unlink" />
              {translate("no_courses")}
            </AdminCoursesNothingFound>
          )}
          {!!coursesQty && (
            <AdminCoursesSidebarStyled>
              {isCourseOpen && selectedCourse ? (
                <AdminCoursesCourseSidebar
                  course={selectedCourse}
                  subjectID={params?.subjectID}
                  moduleCreate={() => setShowUpdateModule(true)}
                  courseUpdate={() => setShowUpdateCourse("edit")}
                  courseDelete={onDeleteSubject}
                  params={params}
                  loading={loading}
                  isLessonCoppied={isLessonCoppied}
                  setIsLessonCoppied={setIsLessonCoppied}
                />
              ) : (
                <span>Предмет не обрано</span>
              )}
            </AdminCoursesSidebarStyled>
          )}
        </AdminCoursesLayoutStyled>
      )}
      {showUpdateSubject ? (
        <UpdateSubject
          subject={subject}
          setShowUpdateSubject={setShowUpdateSubject}
          loading={loading}
        />
      ) : null}
      {showUpdateCourse ? (
        <UpdateCourse
          params={params}
          subjectID={subject.id}
          course={showUpdateCourse === "edit" ? selectedCourse : null}
          loading={loading}
          setShowUpdateCourse={setShowUpdateCourse}
        />
      ) : null}
      {showConfirm ? (
        <Confirm
          message={translate("sure_to_delete_subject")}
          cancelAction={() => setShowConfirm(false)}
          confirmAction={handleDeleteSubject}
        />
      ) : null}
      {showUpdateModule ? (
        <UpdateModule
          params={params}
          subjectID={params.subjectID}
          courseID={params.courseID}
          module={null}
          loading={loading}
          setShowUpdateModule={setShowUpdateModule}
        />
      ) : null}
    </AdminCoursesSubjectStyled>
  );

  function handleCreateModule() {
    setShowUpdateModule(true);
  }

  function checkIfIsOpen() {
    return params && params.subjectID === subject.id;
  }

  function onDeleteSubject() {
    // === Need to write function in database to implement recursive item deletion (for now subject isn't deleted completely)
    // === Solution can be found here https://firebase.google.com/docs/firestore/solutions/delete-collections
    setShowConfirm(true);
  }

  function handleShowCourseUpdate() {
    setShowUpdateCourse("create");
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.currentUser,
    subjectCoursesList: state.coursesReducer.subjectCoursesList,
    subjectCoursesListLoading: state.coursesReducer.subjectCoursesListLoading,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchCoursesList: (subjectID) => dispatch(fetchCoursesList(subjectID)),
  deleteSubject: (subjectID) => dispatch(deleteSubject(subjectID)),
  deleteCourse: (subjectID, courseID) =>
    dispatch(deleteCourse(subjectID, courseID)),
});
export default compose(connect(mapStateToProps, mapDispatchToProps))(
  memo(AdminCoursesSubject),
);

const shimmer = keyframes`
  0 {
  transform: translateX(0);
  }
  100% {
  transform: translateX(100%);
  }
`;

const AdminCoursesSubjectStyled = styled.div`
  &:nth-child(2n) {
    background: #f2f2f2;
  }
`;

const SubjectLinkStyled = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  color: #333;
  text-transform: uppercase;
  font-size: 14px;

  ${({ isSubjectSelected }) =>
    isSubjectSelected &&
    `
  opacity: .25;
  `}

  ${({ isOpen }) =>
    isOpen &&
    `
  background: #4ec1e2;
  color: #fff !important;
  opacity: 1;
  `}

  &:hover {
    background: #4ec1e2;
    color: #fff !important;
    opacity: 1;
  }
`;

const SubjectIcon = styled.i`
  margin-right: 10px;
`;

const AdminCoursesLayoutStyled = styled.div`
  background: #fff;
  display: flex;
  width: 100%;
`;

const AdminCoursesCoursesListStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px 28px;
  width: 100%;
  height: 100%;
`;

const AdminCoursesSidebarStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 460px;
  flex: 0 0 auto;
  background: #fafafa;
  font-family: "Roboto Condensed", Arial, sans-serif;
  text-transform: uppercase;
  color: #999;
  font-weight: bold;
`;

const AdminCoursesNothingFound = styled.div`
  padding: 20px 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 80px;
  font-family: "Roboto Condensed", Arial, sans-serif;
  justify-content: space-around;
  color: #999;
  width: 100%;
`;

const AdminCoursesListItemCoursesStyled = styled.div`
  font-family: "Roboto Condensed", Arial, sans-serif;
  margin-left: 20px;
  text-transform: none;

  ${({ isEmpty }) =>
    isEmpty &&
    `
  color: #e32929;
  `}
`;

const AdminCoursesSkeletonStyled = styled.div`
  width: 250px;
  height: 250px;
  padding: 10px;
  margin: 10px;
  box-sizing: border-box;
`;

const AdminCoursesSkeletonInnerStyled = styled.div`
  background: #fafafa;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #ccc;
  position: relative;
  overflow: hidden;

  &:after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.2) 20%,
      rgba(255, 255, 255, 0.5) 60%,
      rgba(255, 255, 255, 0)
    );
    animation: ${shimmer} 1s infinite;
    content: "";
  }
`;

const AdminCoursesSkeletonIconStyled = styled.i`
  margin-bottom: 40px;
  font-size: 40px;
`;

const AdminCoursesSkeletonTextStyled = styled.div`
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;

  &:before,
  &:after {
    content: "";
    height: 16px;
    width: 100%;
    background: #ccc;
    display: block;
    margin: 4px auto 0;
  }

  &:before {
    margin-top: 0;
  }

  &:after {
    width: 80%;
  }
`;
