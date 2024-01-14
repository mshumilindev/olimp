import React, { useContext, useEffect, useState, memo, useMemo } from 'react';
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import classNames from "classnames";
import {compose} from "redux";
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import siteSettingsContext from "../../../context/siteSettingsContext";
import {deleteCourse, fetchModules} from "../../../redux/actions/coursesActions";
import AdminCoursesModule from '../AdminCoursesModule/AdminCoursesModule';
import UpdateCourse from "../AdminCoursesActions/UpdateCourse";
import ContextMenu from '../../UI/ContextMenu/ContextMenu';
import Confirm from '../../UI/Confirm/Confirm';

function AdminCoursesCourse({user, subjectID, course, params, loading, fetchModules, deleteCourse, usersList, libraryList, location, modulesList, isLessonCoppied, setIsLessonCoppied, showUpdateModule, setShowUpdateModule, handleCreateModule}) {
    const { lang, translate } = useContext(siteSettingsContext);
    const [ showUpdateCourse, setShowUpdateCourse ] = useState(false);
    const [ showConfirm, setShowConfirm ] = useState(false);
    const contextLinks = [
        {
            name: translate('create_module'),
            icon: 'fa fa-plus',
            action: handleCreateModule,
            id: 0
        },
        {
            type: 'divider',
            id: 1
        },
        {
            name: translate('edit_course'),
            icon: 'fa fa-pencil-alt',
            action: handleEditCourse,
            id: 2
        },
        {
            name: translate('delete_course'),
            icon: 'fa fa-trash-alt',
            type: 'error',
            action: handleDeleteCourse,
            id: 3
        }
    ];

    useEffect(() => {
      if ( checkIfIsOpen() ) {
        fetchModules(params.subjectID, course.id);
      }
    }, [location]);

    const isCourseOpen = useMemo(() => {
      return params?.subjectID === subjectID && params?.courseID === course?.id;
    }, [params, subjectID, course]);

    const courseLink = useMemo(() => {
      let link = `/admin-courses/${subjectID}`;

      if ( !params?.courseID || params.courseID !== course?.id ) {
        link += `/${course?.id}`;
      }
      return link;
    }, [params, subjectID, course]);

    return (
      <>
        <AdminCoursesCourseStyled>
          <ContextMenu links={contextLinks}>
              <CourseLinkStyled to={courseLink} isOpen={isCourseOpen}>
                  {
                      checkIfIsOpen() ?
                          loading ?
                              <CourseIconStyled className="fas fa-spinner" />
                              :
                              <CourseIconStyled className="fa fa-graduation-cap isOpen" />
                          :
                          <CourseIconStyled className="fa fa-graduation-cap" />
                  }
                  <CourseTitleStyled>
                    { course.name[lang] ? course.name[lang] : course.name['ua'] }
                  </CourseTitleStyled>
              </CourseLinkStyled>
          </ContextMenu>
        </AdminCoursesCourseStyled>
        {
            showUpdateCourse ?
                <UpdateCourse params={params} subjectID={subjectID} course={course} loading={loading} setShowUpdateCourse={setShowUpdateCourse}/>
                :
                null
        }
        {
            showConfirm ?
                <Confirm message={translate('sure_to_delete_course')} cancelAction={() => setShowConfirm(false)} confirmAction={() => deleteCourse(subjectID, course.id)} />
                :
                null
        }
      </>
    )

    function _renderTextbook(textbook) {
        const foundTextbook = libraryList.find(item => item.id === textbook);

        if ( !foundTextbook ) {
            return (
                <div className="adminCourses__list-item adminCourses__list-item-nothingFound" key={textbook}>
                    <i className="content_title-icon fa fa-unlink" />
                    { translate('no_textbook') }
                </div>
            )
        }
        return (
            <span className="adminCourses__list-item-textbook-name" key={textbook}>
                <Link to={'/admin-library/?item=' + foundTextbook.id}>
                    { foundTextbook.name }
                </Link>
            </span>
        )
    }

    function getUser(user) {
        return usersList.find(item => item.id === user);
    }

    function checkIfIsOpen() {
        return params && params.courseID === course.id;
    }

    function handleEditCourse() {
        setShowUpdateCourse(true);
    }

    function handleDeleteCourse() {
        setShowConfirm(true);
    }

    function sortModules() {
        return modulesList.sort((a, b) => {
            if ( a.index < b.index ) {
                return -1;
            }
            if ( a.index > b.index ) {
                return 1;
            }
            return 0;
        });
    }
}
const mapStateToProps = state => ({
    usersList: state.usersReducer.usersList,
    libraryList: state.libraryReducer.libraryList,
    modulesList: state.coursesReducer.modulesList,
    user: state.authReducer.currentUser
});
const mapDispatchToProps = dispatch => ({
    fetchModules: (subjectID, courseID) => dispatch(fetchModules(subjectID, courseID)),
    deleteCourse: (subjectID, courseID) => dispatch(deleteCourse(subjectID, courseID))
});
export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(memo(AdminCoursesCourse));

const AdminCoursesCourseStyled = styled.div`
  width: 250px;
  height: 250px;
  padding: 10px;
  margin: 10px;
  box-sizing: border-box;

  span {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const CourseLinkStyled = styled(Link)`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  color: #333;

  &:hover {
    color: #fff !important;
    background: #4ec1e2;
  }

  ${({isOpen}) => isOpen && `
    color: #fff !important;
    background: #4ec1e2;
  `}
`;

const CourseIconStyled = styled.i`
  margin-bottom: 40px;
  font-size: 40px;
`;

const CourseTitleStyled = styled.p`
  text-transform: uppercase;
  font-size: 16px;
  padding: 0 20px;
  line-height: 1.25;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
