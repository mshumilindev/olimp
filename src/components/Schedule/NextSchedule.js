import React, { useContext } from 'react';
import {connect} from "react-redux";
import { Link } from 'react-router-dom';
import './nextSchedule.scss';
import styled from 'styled-components';

import Preloader from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";

function NextSchedule({classData, allCoursesList, loadingClasses, loadingCourses}) {
    const { translate, lang } = useContext(siteSettingsContext);

    return (
        <div className="block nextSchedule">
            <div className="block__heading">
                <i className="content_title-icon fa fa-calendar-alt" />
                { translate('current_schedule') }
            </div>
            {
                loadingClasses || loadingCourses ?
                    <Preloader/>
                    :
                    !classData || !allCoursesList ?
                        <div className="nothingFound">{ translate('nothing_found') }</div>
                        :
                        <>
                          <div className="nextSchedule__list">
                              {
                                  filterDays().map(day => _renderDay(day))
                              }
                          </div>
                          <BtnHolderStyled>
                            <Link to={'/schedule'} className="btn btn_primary">Весь розклад</Link>
                          </BtnHolderStyled>
                        </>
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
        const currentSubject = allCoursesList?.find(subject => subject.id === lesson.subject);
        const currentCourse = currentSubject?.coursesList?.find(course => course.id === lesson.course);

        return (
            <div className="nextSchedule__list-courses-item" key={index + lesson.course}>
                <div className="nextSchedule__list-courses-icon">
                    <i className="fa fa-graduation-cap" />
                </div>
                <Link to={'/courses/' + currentSubject?.id + '/' + currentCourse?.id}>
                    {
                        lesson.time ?
                            <span className="nextSchedule__list-courses-item-time">
                                { lesson.time.start.split(':').splice(0, 2).join(':') } &mdash; { lesson.time.end.split(':').splice(0, 2).join(':') }
                            </span>
                            :
                            null
                    }
                    <span className="nextSchedule__list-courses-item-course">
                        { currentCourse?.name[lang] ? currentCourse?.name[lang] : currentCourse?.name['ua'] }
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
                ...classData.schedule[0]
            });
            nextDaysList.push({
                ...classData.schedule[1]
            });
        }
        else if ( today === 5 ) {
            nextDaysList.push({
                ...classData.schedule[today - 1],
                title: 'today'
            });
            nextDaysList.push({
                ...classData.schedule[0]
            });
        }
        else {
            nextDaysList.push({
                ...classData.schedule[today - 1],
                title: 'today'
            });
            nextDaysList.push({
                ...classData.schedule[today],
                title: 'tomorrow'
            });
        }

        return nextDaysList;
    }
}
const mapStateToProps = state => ({
    classData: state.classesReducer.classData,
    loadingClasses: state.classesReducer.loading,
    allCoursesList: state.coursesReducer.coursesList,
    loadingCourses: state.coursesReducer.loading
});

export default connect(mapStateToProps)(NextSchedule);

const BtnHolderStyled = styled.div`
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
`;
