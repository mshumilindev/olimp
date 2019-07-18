import React, { useContext, useEffect } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import {Link} from "react-router-dom";
import {fetchModules} from "../../redux/actions/coursesActions";
import {connect} from "react-redux";
import AdminCoursesModule from './AdminCoursesModule';
import classNames from "classnames";

function AdminCoursesCourse({course, params, loading, fetchModules}) {
    const { lang, translate } = useContext(siteSettingsContext);

    useEffect(() => {
        if ( checkIfIsOpen() && !course.modules ) {
            fetchModules(params.subjectID, course.id);
        }
    });

    return (
        <div className={classNames('adminCourses__list-item', {isOpen: params && !params.moduleID && params.courseID === course.id})} style={{marginTop: 0}}>
            <Link to={'/admin-courses/' + params.subjectID + '/' + course.id} className="adminCourses__list-courses-link">
                {
                    checkIfIsOpen() ?
                        loading ?
                            <i className="content_title-icon fas fa-spinner" />
                            :
                            <i className="content_title-icon fa fa-folder-open" />
                        :
                        <i className="content_title-icon fa fa-folder" />
                }
                { course.name[lang] ? course.name[lang] : course.name['ua'] }
            </Link>
            {
                params && params.courseID === course.id ?
                    <div className="adminCourses__list-courses">
                        {
                            course.modules && course.modules.length ?
                                course.modules.map(item => <AdminCoursesModule module={item} key={item.id} params={params} loading={loading} />)
                                :
                                <div className="adminCourses__list-item-nothingFound">
                                    <i className="content_title-icon fa fa-unlink" />
                                    { translate('nothing_found') }
                                </div>
                        }
                        <div className="adminCourses__list-item adminCourses__add-holder">
                            <a href="/" className="adminCourses__add" onClick={createCourse}>
                                <i className="content_title-icon fa fa-plus" />
                                { translate('create_module') }
                            </a>
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    );

    function createCourse(e) {
        e.preventDefault();

        console.log('create module');
    }

    function checkIfIsOpen() {
        return params && params.courseID === course.id;
    }
}
const mapDispatchToProps = dispatch => ({
    fetchModules: (subjectID, courseID) => dispatch(fetchModules(subjectID, courseID))
});
export default connect(null, mapDispatchToProps)(AdminCoursesCourse);