import React, { useContext } from 'react';
import {connect} from "react-redux";
import {Preloader} from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import { Link } from 'react-router-dom';

function AdminPanelCourses({loading, usersList, allCoursesList}) {
    const { translate, lang } = useContext(siteSettingsContext);

    return (
        <div className="widget">
            <div className="widget__title">
                <i className="content_title-icon fa fa-exclamation-triangle color-warning" />
                { translate('courses_no_teacher') }
            </div>
            {
                loading ?
                    <Preloader/>
                    :
                    usersList && allCoursesList ?
                        <div className="adminDashboard__teachersList">
                            {
                                filterCourses().map(course => _renderCourse(course))
                            }
                            <div className="nothingFound">
                                { translate('no_courses_no_teacher') }
                            </div>
                        </div>
                        :
                        <Preloader/>
            }
        </div>
    );

    function _renderCourse(course) {
        const selectedTeacher = usersList.find(user => user.id === course.course.teacher);

        if ( selectedTeacher && selectedTeacher.status === 'active' ) {
            return null;
        }

        return (
            <div className="adminDashboard__teachersList-item" key={course.course.id}>
                <div className="adminDashboard__teachersList-avatar noBG">
                    <i className="fa fa-graduation-cap" />
                </div>
                <div className="adminDashboard__teachersList-info">
                    <div className="adminDashboard__teachersList-name">
                        <Link to={'/admin-courses/' + course.link}>{ course.course.name[lang] ? course.course.name[lang] : course.course.name['ua'] }</Link>
                    </div>
                    <div className="adminDashboard__teachersList-courses">
                        <span className="no-courses">
                            <i className="content_title-icon fa fa-unlink" />
                            { translate('no_teacher') }
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    function filterCourses() {
        const filteredCourses = [];

        allCoursesList.forEach(subject => {
            if ( subject.coursesList ) {
                subject.coursesList.forEach(course => {
                    filteredCourses.push({
                        link: subject.id + '/' + course.id,
                        course: course
                    });
                });
            }
        });

        return filteredCourses;
    }
}
const mapStateToProps = state => ({
    allCoursesList: state.coursesReducer.coursesList,
    usersList: state.usersReducer.usersList,
    loading: state.usersReducer.loading
});
export default connect(mapStateToProps)(AdminPanelCourses);
