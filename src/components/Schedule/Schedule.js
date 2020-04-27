import React, { useContext } from 'react';
import {connect} from "react-redux";
import Preloader from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import { Link } from 'react-router-dom';
import './nextSchedule.scss';

function Schedule({classData, allCoursesList, loadingClasses, loadingCourses}) {
    const { translate, lang } = useContext(siteSettingsContext);

    return (
        <div className="block nextSchedule allSchedule">
            {
                loadingClasses || loadingCourses ?
                    <Preloader/>
                    :
                    !classData || !allCoursesList ?
                        <div className="nothingFound">
                            { translate('nothing_found') }
                        </div>
                        :
                        <div className="nextSchedule__list">
                            {
                                classData.schedule.map(day => _renderDay(day))
                            }
                        </div>
            }
        </div>
    );

    function _renderDay(day) {
        return (
            <div className="nextSchedule__list-item" key={day.title}>
                <div className="nextSchedule__list-title">
                    { translate(day.title) }
                </div>
                <div className="nextSchedule__list-courses">
                    {
                        classData.courses.length && day.lessons.length ?
                            day.lessons.sort((a, b) => {
                                if ( a.time && b.time ) {
                                    if ( a.time.start < b.time.start ) {
                                        return -1;
                                    }
                                    else if ( a.time.start > b.time.start ) {
                                        return 1;
                                    }
                                    else {
                                        return 0;
                                    }
                                }
                                return 0;
                            }).map((lesson, index) => _renderCourse(lesson, index))
                            :
                            <div className="nextSchedule__list-courses-item nextSchedule__list-courses-notFound">
                                <div className="nextSchedule__list-courses-icon">
                                    <i className="fa fa-unlink" />
                                </div>
                                { translate('no_lessons') }
                            </div>
                    }
                </div>
            </div>
        )
    }

    function _renderCourse(lesson, index) {
        const currentSubject = allCoursesList.find(subject => subject.id === lesson.subject);
        const currentCourse = currentSubject.coursesList.find(course => course.id === lesson.course);

        return (
            <div className="nextSchedule__list-courses-item" key={index + lesson.course}>
                <div className="nextSchedule__list-courses-icon">
                    <i className="fa fa-graduation-cap" />
                </div>
                <Link to={'/courses/' + currentSubject.id + '/' + currentCourse.id}>
                    {
                        lesson.time ?
                            <span className="nextSchedule__list-courses-item-time">
                                { lesson.time.start.split(':').splice(0, 2).join(':') } &mdash; { lesson.time.end.split(':').splice(0, 2).join(':') }
                            </span>
                            :
                            null
                    }
                    <span className="nextSchedule__list-courses-item-subject">
                        { currentSubject.name[lang] ? currentSubject.name[lang] : currentSubject.name['ua'] }
                    </span>
                    <span className="nextSchedule__list-courses-item-course">
                        { currentCourse.name[lang] ? currentCourse.name[lang] : currentCourse.name['ua'] }
                    </span>
                </Link>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    classData: state.classesReducer.classData,
    loadingClasses: state.classesReducer.loading,
    allCoursesList: state.coursesReducer.coursesList,
    loadingCourses: state.coursesReducer.loading
});

export default connect(mapStateToProps)(Schedule);