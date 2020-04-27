import React, { useContext } from 'react';
import {connect} from "react-redux";
import Preloader from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { orderBy } from 'natural-orderby';

function AdminPanelTeachers({loading, usersList, allCoursesList, heading, showCourses}) {
    const { translate, lang } = useContext(siteSettingsContext);

    return (
        <div className="widget">
            <div className="widget__title">
                {
                    showCourses ?
                        <i className="content_title-icon fa fa-users" />
                        :
                        <i className="content_title-icon fa fa-exclamation-triangle color-warning" />
                }
                { heading }
            </div>
            {
                loading ?
                    <Preloader/>
                    :
                    usersList && allCoursesList ?
                        <Scrollbars
                            autoHeight
                            hideTracksWhenNotNeeded
                            autoHeightMax={500}
                            renderTrackVertical={props => <div {...props} className="scrollbar__track"/>}
                            renderView={props => <div {...props} className="scrollbar__content"/>}
                        >
                            <div className="adminDashboard__teachersList">
                                {
                                    filterUsers().map(teacher => _renderTeacher(teacher))
                                }
                                <div className="nothingFound">
                                    {
                                        showCourses ?
                                            translate('no_teachers_with_courses')
                                            :
                                            translate('no_teachers_no_courses')
                                    }
                                </div>
                            </div>
                        </Scrollbars>
                        :
                        <Preloader/>
            }
        </div>
    );

    function _renderTeacher(teacher) {
        const selectedCourses = [];

        if ( allCoursesList ) {
            allCoursesList.forEach(subject => {
                if ( subject.coursesList ) {
                    subject.coursesList.forEach(course => {
                        if ( course.teacher === teacher.id ) {
                            selectedCourses.push({
                                link: subject.id + '/' + course.id,
                                courseName: course.name[lang] ? course.name[lang] : course.name['ua']
                            })
                        }
                    });
                }
            });
        }

        if ( showCourses && !selectedCourses.length ) {
            return null;
        }
        if ( !showCourses && selectedCourses.length ) {
            return null;
        }

        return (
            <div className="adminDashboard__teachersList-item" key={teacher.id}>
                <div className="adminDashboard__teachersList-avatar" style={{backgroundImage: 'url(' + teacher.avatar + ')'}}>
                    {
                        !teacher.avatar ?
                            <i className="fa fa-user" />
                            :
                            null
                    }
                </div>
                <div className="adminDashboard__teachersList-info">
                    <div className="adminDashboard__teachersList-name">
                        <Link to={'/admin-users/' + teacher.login}>
                            { teacher.name }
                        </Link>
                    </div>
                    <div className="adminDashboard__teachersList-courses">
                        {
                            selectedCourses.length ?
                                orderBy(selectedCourses, [v => v.courseName]).map(course => {
                                    return (
                                        <span key={course.courseName}>
                                            <i className="content_title-icon fa fa-graduation-cap" />
                                            <Link to={'/admin-courses/' + course.link}>{ course.courseName }</Link>
                                            <br/>
                                        </span>
                                    );
                                })
                                :
                                <span className="no-courses">
                                    <i className="content_title-icon fa fa-unlink" />
                                    { translate('no_courses') }
                                </span>
                        }
                    </div>
                </div>
            </div>
        )
    }

    function filterUsers() {
        return usersList.filter(user => user.role === 'teacher' && user.status === 'active').sort((a, b) => {
            if ( a.name < b.name ) {
                return -1;
            }
            else if ( a.name > b.name ) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }
}
const mapStateToProps = state => ({
    allCoursesList: state.coursesReducer.coursesList,
    usersList: state.usersReducer.usersList,
    loading: state.usersReducer.loading
});
export default connect(mapStateToProps)(AdminPanelTeachers);
