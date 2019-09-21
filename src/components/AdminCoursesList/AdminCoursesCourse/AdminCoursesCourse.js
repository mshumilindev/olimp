import React, { useContext, useEffect, useState } from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import {Link} from "react-router-dom";
import {deleteCourse, fetchModules} from "../../../redux/actions/coursesActions";
import {connect} from "react-redux";
import AdminCoursesModule from '../AdminCoursesModule/AdminCoursesModule';
import classNames from "classnames";
import UpdateCourse from "../AdminCoursesActions/UpdateCourse";
import UpdateModule from "../AdminCoursesActions/UpdateModule";
import {fetchLibrary} from "../../../redux/actions/libraryActions";
import userContext from "../../../context/userContext";

const ContextMenu = React.lazy(() => import('../../UI/ContextMenu/ContextMenu'));
const Confirm = React.lazy(() => import('../../UI/Confirm/Confirm'));

function AdminCoursesCourse({subjectID, course, params, loading, fetchModules, deleteCourse, usersList, libraryList}) {
    const { lang, translate } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);
    const [ showUpdateCourse, setShowUpdateCourse ] = useState(false);
    const [ showUpdateModule, setShowUpdateModule ] = useState(false);
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
        if ( checkIfIsOpen() && !course.modules ) {
            fetchModules(params.subjectID, course.id);
        }
    });

    return (
        <div className={classNames('adminCourses__list-item', {someOpen: params && params.courseID && params.courseID !== course.id, isOpen: params && !params.moduleID && params.courseID === course.id})} style={{marginTop: 10}}>
            <ContextMenu links={contextLinks} dontShow={user.role !== 'admin'}>
                <Link to={'/admin-courses/' + params.subjectID + '/' + course.id} className="adminCourses__list-courses-link">
                    {
                        checkIfIsOpen() ?
                            loading ?
                                <i className="content_title-icon fas fa-spinner" />
                                :
                                <i className="content_title-icon fa fa-graduation-cap isOpen" />
                            :
                            <i className="content_title-icon fa fa-graduation-cap" />
                    }
                    { course.name[lang] ? course.name[lang] : course.name['ua'] }
                </Link>
            </ContextMenu>
            {
                checkIfIsOpen() ?
                    course.teacher && getUser(course.teacher).status === 'active' ?
                        <div className="adminCourses__list-item-teacher">
                            {
                                usersList.length ?
                                    <div className="adminCourses__list-item-teacher-name">
                                        <i className="fa fa-user" style={{marginRight: 15}} />
                                        <span className="adminCourses__list-item-teacher-role">
                                            { translate(getUser(course.teacher).role) }
                                        </span>
                                        <Link to={'/admin-users/' + getUser(course.teacher).login}>{ getUser(course.teacher).name }</Link>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                        :
                        <div className="adminCourses__list-item adminCourses__list-item-nothingFound" style={{marginTop: 10, marginLeft: 28}}>
                            <i className="content_title-icon fa fa-user" />
                            { translate('no_teacher') }
                        </div>
                    :
                    null
            }
            {
                checkIfIsOpen() ?
                    course.textbook && libraryList.find(item => item.id === course.textbook) ?
                        <div className="adminCourses__list-item-textbook">
                            <i className="fa fa-bookmark" style={{marginRight: 16}} />
                            <span className="adminCourses__list-item-textbook-label">
                                {
                                    translate('textbook')
                                }
                            </span>
                            {
                                libraryList.length ?
                                    libraryList.find(item => item.id === course.textbook).name
                                    :
                                    null
                            }
                        </div>
                        :
                        <div className="adminCourses__list-item adminCourses__list-item-nothingFound" style={{marginTop: 10, marginLeft: 28}}>
                            <i className="content_title-icon fa fa-bookmark" />
                            { translate('no_textbook') }
                        </div>
                    :
                    null
            }
            {
                params && params.courseID === course.id ?
                    <div className="adminCourses__list-courses" style={{marginTop: -10, marginBottom: 20}}>
                        <div className="adminCourses__list-item" style={{marginTop: 10, paddingLeft: 0}}>
                            <div className="adminCourses__list-courses-link" style={{paddingLeft: 0}}>
                                { translate('modules') }
                            </div>
                        </div>
                        {
                            course.modules && course.modules.length ?
                                sortModules().map(item => <AdminCoursesModule subjectID={subjectID} courseID={course.id} module={item} key={item.index} params={params} loading={loading} />)
                                :
                                <div className="adminCourses__list-item adminCourses__list-item-nothingFound" style={{marginTop: 10}}>
                                    <i className="content_title-icon fa fa-unlink" />
                                    { translate('no_modules') }
                                </div>
                        }
                    </div>
                    :
                    null
            }
            {
                showUpdateCourse ?
                    <UpdateCourse params={params} subjectID={subjectID} course={course} loading={loading} setShowUpdateCourse={setShowUpdateCourse}/>
                    :
                    null
            }
            {
                showUpdateModule ?
                    <UpdateModule params={params} subjectID={subjectID} courseID={course.id} module={null} loading={loading} setShowUpdateModule={setShowUpdateModule}/>
                    :
                    null
            }
            {
                showConfirm ?
                    <Confirm message={translate('sure_to_delete_course')} cancelAction={() => setShowConfirm(false)} confirmAction={() => deleteCourse(subjectID, course.id)} />
                    :
                    null
            }
        </div>
    );

    function getUser(user) {
        return usersList.find(item => item.id === user);
    }

    function checkIfIsOpen() {
        return params && params.courseID === course.id;
    }

    function handleCreateModule() {
        setShowUpdateModule(true);
    }

    function handleEditCourse() {
        setShowUpdateCourse(true);
    }

    function handleDeleteCourse() {
        setShowConfirm(true);
    }

    function sortModules() {
        return course.modules.sort((a, b) => {
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
});
const mapDispatchToProps = dispatch => ({
    fetchLibrary: dispatch(fetchLibrary()),
    fetchModules: (subjectID, courseID) => dispatch(fetchModules(subjectID, courseID)),
    deleteCourse: (subjectID, courseID) => dispatch(deleteCourse(subjectID, courseID))
});
export default connect(mapStateToProps, mapDispatchToProps)(AdminCoursesCourse);