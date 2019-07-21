import React, { useContext, useEffect } from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import {Link} from "react-router-dom";
import {fetchModules} from "../../../redux/actions/coursesActions";
import {connect} from "react-redux";
import AdminCoursesModule from '../AdminCoursesModule/AdminCoursesModule';
import classNames from "classnames";

const ContextMenu = React.lazy(() => import('../../UI/ContextMenu/ContextMenu'));

function AdminCoursesCourse({course, params, loading, fetchModules}) {
    const { lang, translate } = useContext(siteSettingsContext);
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
            <ContextMenu links={contextLinks}>
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
                params && params.courseID === course.id ?
                    <div className="adminCourses__list-courses" style={{marginTop: -10}}>
                        {
                            course.modules && course.modules.length ?
                                course.modules.map(item => <AdminCoursesModule module={item} key={item.id} params={params} loading={loading} />)
                                :
                                <div className="adminCourses__list-item adminCourses__list-item-nothingFound" style={{marginTop: 10}}>
                                    <i className="content_title-icon fa fa-unlink" />
                                    { translate('nothing_found') }
                                </div>
                        }
                    </div>
                    :
                    null
            }
        </div>
    );

    function checkIfIsOpen() {
        return params && params.courseID === course.id;
    }

    function handleCreateModule() {
        console.log('create module');
    }

    function handleEditCourse() {
        console.log('edit course');
    }

    function handleDeleteCourse() {
        console.log('delete course');
    }
}
const mapDispatchToProps = dispatch => ({
    fetchModules: (subjectID, courseID) => dispatch(fetchModules(subjectID, courseID))
});
export default connect(null, mapDispatchToProps)(AdminCoursesCourse);