import React, {useCallback, useContext, useMemo, useEffect, useRef} from 'react';
import Preloader from "../../components/UI/preloader";
import './journal.scss';
import { connect } from 'react-redux';
import moment from "moment";
import classNames from "classnames";
import siteSettingsContext from "../../context/siteSettingsContext";
import {orderBy} from "natural-orderby";
import {fetchClasses} from "../../redux/actions/classesActions";

moment.locale('uk');

const daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];
const daysNames = {
    'пн': 'monday',
    'вт': 'tuesday',
    'ср': 'wednesday',
    'чт': 'thursday',
    'пт': 'friday',
    'сб': 'saturday',
    'нд': 'sunday'
};

const Journal = ({attendance, coursesList, classesList, coursesLoading, classesLoading, user}) => {
    const { lang, translate } = useContext(siteSettingsContext);
    const tableRef = useRef(null);

    const loading = useMemo(() => {
        return classesLoading || coursesLoading;
    }, [classesLoading, coursesLoading]);

    useEffect(() => {
        const today = moment().format('DD_MMMM_YYYY');

        if ( !loading && tableRef.current ) {
            const todayCol = tableRef.current.querySelector('[data-date="' + today + '"]');

            tableRef.current.scrollTo({left: todayCol.getBoundingClientRect().left});
        }
    }, [loading, tableRef]);

    const schedule = useMemo(() => {
        return classesList ? classesList.find(item => item.id === user.class).schedule : [];
    }, [classesList, user]);

    const days = useMemo(() => {
        const currentMonth = moment().month() + 1;
        let startYear = moment().year();
        let endYear = moment().year() + 1;
        const startMonth = 9;
        const endMonth = 5;
        const days = [];

        if ( currentMonth > 0 && currentMonth < 9 ) {
            startYear--;
            endYear--;
        }

        let startDate = moment(startMonth + '.' + 1 + '.' + startYear).subtract(1, 'day').unix();
        const endDate = moment(endMonth + 1 + '.' + 1 + '.' + endYear).subtract(1, 'day').unix();

        while ( startDate < endDate ) {
            startDate = moment(startDate * 1000).add(1, 'day').unix();
            days.push(startDate);
            if ( startDate === moment().startOf('day').unix() ) {
                break;
            }
        }

        return days;
    }, []);

    const isWeekend = useCallback(date => moment(date * 1000).weekday() === 5 || moment(date * 1000).weekday() === 6, []);

    const _renderTableHead = useCallback(() => {
        return days.map(day => {
            const date = moment(day * 1000);
            const isToday = day === moment().startOf('day').unix();

            return (
                <th className="table__head-cell" key={'th' + day} data-date={date.format('DD_MMMM_YYYY')}>
                    <div className={classNames('journal__date', {journal__weekend: isWeekend(day), journal__today: isToday})}>
                        <em className="journal__date-day">
                            { isToday && translate('today') + ': ' }
                            { daysOfWeek[date.weekday()] }
                        </em>
                        <span className="journal__date-month">{ date.format('DD.MM') }</span>
                        <span className="journal__date-year">{ date.format('YYYY') }</span>
                    </div>
                </th>
            )
        });
    }, [days, isWeekend]);

    const _renderTableCols = useCallback(() => {
        return days.map((day) => {
            return (
                <col width={200} key={'col' + day}/>
            )
        });
    }, [days]);

    const _renderCoursesList = useCallback((day, time) => {
        const date = moment(day * 1000);
        const scheduleDay = schedule.find(item => item.title === daysNames[daysOfWeek[date.weekday()]]);

        if ( scheduleDay.lessons ) {
            const lessonByTime = scheduleDay.lessons.find(lessonItem => lessonItem.time.start === time.start && lessonItem.time.end === time.end);

            if ( lessonByTime ) {
                const subject = coursesList.find(subjectItem => subjectItem.id === lessonByTime.subject);
                const markedDay = attendance.find(item => item.day === date.format('DD_MMMM_YYYY'));
                let markedCourse = null;

                if ( markedDay && markedDay.courses.length ) {
                    markedCourse = markedDay.courses.find(item => (typeof item === 'string' && item === lessonByTime.course) || (typeof item === 'object' && item.course === lessonByTime.course && item.start === lessonByTime.time.start));
                }

                return (
                    <div className={classNames('journal__course', {attended: markedCourse, skipped: !markedCourse})}>
                        <div className="journal__course-item">
                            <div className="journal__course-subject">
                                { subject.name[lang] ? subject.name[lang] : subject.name['ua'] }
                            </div>
                            <div className="journal__course-attended">
                                {
                                    markedCourse ?
                                        translate('attended')
                                        :
                                        translate('skipped')
                                }
                            </div>
                            {
                                markedCourse && markedCourse.mark && (
                                    <div className="journal__course-mark">
                                        <span>
                                            { translate('mark') }:&nbsp;
                                        </span>
                                        <span>
                                            { markedCourse.mark }
                                        </span>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )
            }
        }

        return null;
    }, [schedule, attendance, coursesList, lang, translate]);

    const filterLessonsByTime = useMemo(() => {
        const timeSlots = [];

        schedule.forEach((scheduleDay) => {
            if ( scheduleDay.lessons.length ) {
                scheduleDay.lessons.forEach((lessonItem) => {
                    if ( !timeSlots.some(slot => slot.start === lessonItem.time.start) ) {
                        timeSlots.push(lessonItem.time);
                    }
                });
            }
        });

        return orderBy(timeSlots, v => v.start);
    }, [schedule]);

    const _renderTableBody = useCallback(() => {
        if ( filterLessonsByTime.length ) {
            return filterLessonsByTime.map(item => (
                <tr className="table__body-row" key={'row' + item.start}>
                    <td className="table__body-cell">
                        <div className="journal__course-time">
                            { item.start }<br/>•<br/>{ item.end }
                        </div>
                    </td>
                    {
                        days.map((day) => <td className="table__body-cell" key={'td' + day}>{ _renderCoursesList(day, item) }</td>)
                    }
                </tr>
            ));
        }
    }, [days, _renderCoursesList, schedule, filterLessonsByTime]);

    return (
        <div className="journal">
            {
                attendance && !loading ?
                    <div className="journal__holder">
                        <div className="table__holder" ref={tableRef}>
                            <table className="table">
                                <colgroup>
                                    <col width={100}/>
                                    { _renderTableCols() }
                                </colgroup>
                                <thead className="table__head">
                                <tr className="table__head-row">
                                    <th className="table__head-cell"/>
                                    { _renderTableHead() }
                                </tr>
                                </thead>
                                <tbody className="table__body">
                                    { _renderTableBody() }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    :
                    <Preloader/>
            }
        </div>
    )
};


const mapStateToProps = state => {
    return {
        classesList: state.classesReducer.classesList,
        classesLoading: state.classesReducer.loading,
        coursesLoading: state.coursesReducer.loading,
        coursesList: state.coursesReducer.coursesList
    }
};

const mapDispatchToProps = dispatch => ({
    fetchClasses: dispatch(fetchClasses()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Journal);