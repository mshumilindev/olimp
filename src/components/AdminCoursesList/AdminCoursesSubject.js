import React, { useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import siteSettingsContext from '../../context/siteSettingsContext';
import AdminCoursesCourse from './AdminCoursesCourse';
import {fetchCoursesList} from "../../redux/actions/coursesActions";
import {connect} from "react-redux";
import classNames from 'classnames';

function AdminCoursesSubject({loading, subject, params, fetchCoursesList}) {
    const { lang, translate } = useContext(siteSettingsContext);

    useEffect(() => {
        if ( checkIfIsOpen() && !subject.coursesList ) {
            fetchCoursesList(subject.id);
        }
    });

    return (
        <div className={classNames('adminCourses__list-item', {someOpen: params && params.subjectID !== subject.id, isOpen: params && !params.courseID && params.subjectID === subject.id})}>
            <Link to={'/admin-courses/' + (params && params.subjectID === subject.id ? '' : subject.id)} className="adminCourses__list-link">
                {
                    checkIfIsOpen() ?
                        loading ?
                            <i className="content_title-icon fas fa-spinner" />
                            :
                            <i className="content_title-icon fa fa-folder-open" />
                        :
                        <i className="content_title-icon fa fa-folder" />
                }
                { subject.name[lang] ? subject.name[lang] : subject.name['ua'] }
            </Link>
            {
                params && params.subjectID === subject.id ?
                    <div className="adminCourses__list-courses">
                        {
                            subject.coursesList && subject.coursesList.length ?
                                subject.coursesList.map(item => <AdminCoursesCourse course={item} key={item.id} params={params} loading={loading} />)
                                :
                                <div className="adminCourses__list-item-nothingFound">
                                    <i className="content_title-icon fa fa-unlink" />
                                    { translate('nothing_found') }
                                </div>
                        }
                        <div className="adminCourses__list-item adminCourses__add-holder">
                            <a href="/" className="adminCourses__add" onClick={createCourse}>
                                <i className="content_title-icon fa fa-plus" />
                                { translate('create_course') }
                            </a>
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    );

    function checkIfIsOpen() {
        return params && params.subjectID === subject.id;
    }

    function createCourse(e) {
        e.preventDefault();

        console.log('create course');
    }
}
const mapDispatchToProps = dispatch => ({
    fetchCoursesList: (subjectID) => dispatch(fetchCoursesList(subjectID))
});
export default connect(null, mapDispatchToProps)(AdminCoursesSubject);