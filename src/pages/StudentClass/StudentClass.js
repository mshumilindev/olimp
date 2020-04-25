import React, { useContext } from 'react';
import {connect} from "react-redux";
import {Preloader} from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import userContext from "../../context/userContext";
import { Link } from 'react-router-dom';
import './studentClass.scss';
import Notifications from "../../components/Notifications/Notifications";

function StudentClass({classData, allCoursesList, usersList}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);

    return (
        <div className="studentClass">
            <div className="content__title-holder">
                <h2 className="content__title">
                    <i className="content_title-icon fa fa-graduation-cap" />
                    <div className="content__title-inner">
                        <span className="content__title-subtitle">
                            { translate('class') }
                        </span>
                        {
                            !classData ?
                                <Preloader size={20} color="#fff"/>
                                :
                                classData.title[lang] ?
                                    classData.title[lang]
                                    :
                                    classData.title['ua']
                        }
                    </div>
                </h2>
            </div>
            <Notifications/>
            {
                !classData || !allCoursesList || !usersList.length ?
                    <Preloader/>
                    :
                    <>
                        {
                            classData.info[lang] || classData.info['ua'] ?
                                <div className="block studentClass__description">
                                    <h2 className="block__heading">{ translate('description') }</h2>
                                    <div className="studentClass__description-text">
                                        {
                                            classData.info[lang] ?
                                                classData.info[lang]
                                                :
                                                classData.info['ua']
                                        }
                                    </div>
                                </div>
                                :
                                null
                        }
                        <div className="grid">
                            <div className="grid_col col-12 tablet-col-6">
                                <div className="block studentClass__courses">
                                    <h2 className="block__heading">{ translate('courses') }</h2>
                                    { classData.courses.sort((a, b) => {
                                        if ( a.subject < b.subject ) {
                                            return -1;
                                        }
                                        else if ( a.subject > b.subject ) {
                                            return 1;
                                        }
                                        else {
                                            return 0;
                                        }
                                    }).map(course => _renderCourse(course)) }
                                </div>
                            </div>
                            <div className="grid_col col-12 tablet-col-6">
                                <div className="block studentClass__students">
                                    <h2 className="block__heading">{ translate('students') }</h2>
                                    { _renderUser(user) }
                                    { findUsers().map(item => _renderUser(item)) }
                                </div>
                            </div>
                        </div>
                    </>
            }
        </div>
    );

    function _renderCourse(course) {
        const currentSubject = allCoursesList.find(item => item.id === course.subject);
        const currentCourse = currentSubject.coursesList.find(item => item.id === course.course);

        return (
            <div className="studentClass__courses-item" key={course.course}>
                <div className="studentClass__courses-icon">
                    <i className="fa fa-book" />
                </div>
                <div className="studentClass__courses-title">
                    <Link to={'/courses/' + currentSubject.id + '/' + currentCourse.id} className="studentClass__courses-link">
                        <span className="studentClass__courses-subject">
                            {
                                currentSubject.name[lang] ?
                                    currentSubject.name[lang]
                                    :
                                    currentSubject.name['ua']
                            }
                        </span>
                        <span className="studentClass__courses-course">
                            {
                                currentCourse.name[lang] ?
                                    currentCourse.name[lang]
                                    :
                                    currentCourse.name['ua']
                            }
                        </span>
                    </Link>
                </div>
            </div>
        )
    }

    function _renderUser(item) {

        return (
            <div className="studentClass__students-item" key={item.id}>
                <div className="studentClass__students-avatar" style={{backgroundImage: 'url(' + item.avatar + ')'}}>
                    {
                        !item.avatar ?
                            <i className="fa fa-user" />
                            :
                            null
                    }
                </div>
                <div className="studentClass__students-name">
                    <Link to={item.id === user.id ? '/profile' : '/user/' + item.login}>
                        { item.name }
                    </Link>
                </div>
            </div>
        )
    }

    function findUsers() {
        return usersList.filter(item => item.status === 'active' && item.role === 'student' && item.class === user.class && item.id !== user.id).sort((a, b) => {
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
    classData: state.classesReducer.classData,
    allCoursesList: state.coursesReducer.coursesList,
    usersList: state.usersReducer.usersList
});

export default connect(mapStateToProps)(StudentClass);
