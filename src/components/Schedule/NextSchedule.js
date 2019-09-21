import React, { useContext, useEffect, useState } from 'react';
import {connect} from "react-redux";
import {Preloader} from "../UI/preloader";
import userContext from "../../context/userContext";
import siteSettingsContext from "../../context/siteSettingsContext";
import { Link } from 'react-router-dom';
import './nextSchedule.scss';

function NextSchedule({classesList, allCoursesList, loadingClasses, loadingCourses}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);
    const [ currentClass, setCurrentClass ] = useState(null);
    
    useEffect(() => {
        if ( classesList ) {
            setCurrentClass(classesList.find(item => item.id === user.class));
        }
    }, [classesList, user.class]);

    return (
        <div className="block nextSchedule">
            <div className="block__heading">
                <i className="content_title-icon fa fa-calendar-alt" />
                { translate('current_schedule') }
            </div>
            {
                loadingClasses || loadingCourses || !currentClass || !allCoursesList ?
                    <Preloader color={'#7f00a3'}/>
                    :
                    <div className="nextSchedule__list">
                        {
                            filterDays().map(day => _renderDay(day))
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
                        day.lessons.length ?
                            day.lessons.map((lesson, index) => _renderCourse(lesson, index))
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
                <Link to={'/course/' + currentSubject.id + '/' + currentCourse.id}>
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

    function filterDays() {
        const nextDaysList = [];
        const today = new Date().getDay();

        if ( today === 6 || today === 0 ) {
            nextDaysList.push({
                ...currentClass.schedule[0]
            });
            nextDaysList.push({
                ...currentClass.schedule[1]
            });
        }
        else if ( today === 5 ) {
            nextDaysList.push({
                ...currentClass.schedule[today - 1],
                title: 'today'
            });
            nextDaysList.push({
                ...currentClass.schedule[0]
            });
        }
        else {
            nextDaysList.push({
                ...currentClass.schedule[today - 1],
                title: 'today'
            });
            nextDaysList.push({
                ...currentClass.schedule[today],
                title: 'tomorrow'
            });
        }

        return nextDaysList;
    }
}
const mapStateToProps = state => ({
    classesList: state.classesReducer.classesList,
    loadingClasses: state.classesReducer.loading,
    allCoursesList: state.coursesReducer.coursesList,
    loadingCourses: state.coursesReducer.loading
});

export default connect(mapStateToProps)(NextSchedule);