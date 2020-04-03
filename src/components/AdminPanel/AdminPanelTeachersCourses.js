import React, { useContext } from 'react';
import {connect} from "react-redux";
import {Preloader} from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import { Link } from 'react-router-dom';
import userContext from "../../context/userContext";

function AdminPanelTeachersCourses({loading, usersList, allCoursesList}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);

    return (
        <div className="widget">
            <div className="widget__title">
                <i className="content_title-icon fa fa-book" />
                { translate('my_courses') }
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
                                { translate('have_no_courses') }
                            </div>
                        </div>
                        :
                        <Preloader/>
            }
        </div>
    );

    function _renderCourse(course) {
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
                            { course.subject }
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
                    if ( course.teacher === user.id ) {
                        filteredCourses.push({
                            subject: subject.name[lang] ? subject.name[lang] : subject.name['ua'],
                            link: subject.id + '/' + course.id,
                            course: course
                        });
                    }
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
export default connect(mapStateToProps)(AdminPanelTeachersCourses);
