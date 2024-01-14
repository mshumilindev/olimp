import React, {Fragment, useCallback, useContext, useMemo} from 'react';
import moment from "moment";
import {orderBy} from "natural-orderby";
import classNames from "classnames";
import {connect} from "react-redux";
import styled from 'styled-components';

import siteSettingsContext from "../../context/siteSettingsContext";
import Preloader from "../UI/preloader";

const AdminAttendanceTable = ({filterByDate, usersList, updateUser, showOnlyMy, coursesList, user, list, usersLoading}) => {
    const { translate, lang } = useContext(siteSettingsContext);

    const days = useMemo(() => {
        let i = filterByDate.start - 86400;
        const days = [];

        while ( i < filterByDate.end ) {
            i += 86400;
            days.push(i);
        }

        return days;
    }, [filterByDate]);

    const isWeekend = useCallback((day) => moment(day * 1000).format('dd') === 'сб' || moment(day * 1000).format('dd') === 'нд', []);

    const _renderHead = useCallback((dayItem) => {
        const isToday = moment(dayItem * 1000).startOf('day').unix() === moment().startOf('day').unix();

        return (
            <th className="table__head-cell" key={dayItem}>
                <div className={classNames('adminAttendance__day', {isWeekend: isWeekend(dayItem), isToday: isToday})}>
                    <strong>
                        { isToday && <em className="today">{ translate('today') }: </em> }
                        { moment(dayItem * 1000).format('dd') }
                        <br/>
                        <span>
                            { moment(dayItem * 1000).format('DD.MM') }
                        </span>
                    </strong>
                </div>
            </th>
        )
    }, [isWeekend, translate]);

    const filterUsers = useCallback((classItem) => {
        return orderBy(usersList, v => v.name)
            .filter(userItem => userItem.role === 'student' && userItem.status === 'active')
            .filter(userItem => userItem.class === classItem);
    }, [usersList]);

    const checkForMark = useCallback((dayAttCourses, lessonItem) => {
        return dayAttCourses.find(item => (typeof item === 'string' && item === lessonItem.course) || (typeof item === 'object' && item.course === lessonItem.course && item.start === lessonItem.time.start));
    }, []);

    const addAttendance = useCallback((userID, dayItem, courseItem, startTime, mark) => {
        const formattedDayItem = moment(dayItem * 1000).format('DD_MMMM_YYYY');
        const foundUser = usersList.find(userItem => userItem.id === userID);
        const attendance = foundUser.attendance || [];
        const attDayIndex = attendance.find(attItem => attItem.day === formattedDayItem) ? attendance.indexOf(attendance.find(attItem => attItem.day === formattedDayItem)) : attendance.length;
        const attDay = attendance.find(attItem => attItem.day === formattedDayItem) || {day: formattedDayItem, courses: []};

        if ( checkForMark(attDay.courses, {course: courseItem, time: {start: startTime}}) ) {
            if ( mark ) {
                let newDay = attDay.courses.find(item => (typeof item === 'string' && item === courseItem) || (typeof item === 'object' && item.course === courseItem && item.start === startTime));
                const newDayIndex = attDay.courses.indexOf(newDay);
                if ( typeof newDay === 'string' ) {
                    newDay = {
                        course: courseItem,
                        start: startTime,
                        mark: mark
                    }
                }
                else {
                    newDay.mark = mark;
                }
                attDay.courses[newDayIndex] = newDay;
            }
            else {
                attDay.courses = attDay.courses.filter(item => {
                    if ( typeof item === 'string' && item === courseItem ) {
                        return false;
                    }
                    if ( typeof item === 'object' && item.course === courseItem && item.start === startTime ) {
                        return false;
                    }
                    return item;
                });
            }
        }
        else {
            attDay.courses.push({course: courseItem, start: startTime, mark: mark ? mark : ''});
        }
        attendance[attDayIndex] = attDay;
        updateUser(userID, {attendance: attendance});
    }, [updateUser, usersList, checkForMark]);

    const handleMarkChange = useCallback((userID, dayItem, courseItem, startTime) => (e) =>  {
        let mark = parseInt(e.target.value);

        if ( mark < 0 ) {
            mark = 0;
        }
        if ( mark > 12 ) {
            mark = 12;
        }

        addAttendance(userID, dayItem, courseItem, startTime, mark);
    }, [addAttendance]);

    const subjectsByTeacher = useMemo(() => {
        if ( user && coursesList ) {
            const subjects = coursesList.filter((subject) => subject.coursesList.some(course => course.teacher === user.id));
            const newSubjects = [];

            subjects.forEach(subject => {
                if ( subject.coursesList.filter(course => course.teacher === user.id).length ) {
                    newSubjects.push({
                        ...subject,
                        coursesList: subject.coursesList.filter(course => course.teacher === user.id)
                    });
                }
            });

            return newSubjects;
        }
        return null;
    }, [coursesList, user]);

    const classByTeacherSubjects = useCallback((courses) => {
        return courses.some(course => subjectsByTeacher.some(teacherSubject => teacherSubject.coursesList.some(teacherCourse => teacherCourse.id === course.course)));
    }, [subjectsByTeacher]);

    const _renderMark = useCallback((lessonItem, index, dayAtt, dayItem, userItem) => {
        const foundCourse = coursesList?.find(subjectItem => subjectItem.id === lessonItem.subject)?.coursesList?.find(courseItem => courseItem.id === lessonItem.course);

        if ( user.role !== 'admin' && showOnlyMy && foundCourse?.teacher !== user.id ) {
            return null;
        }

        return (
            <div className={classNames('adminAttendance__check', {isWeekend: isWeekend(dayItem), isChecked: dayAtt && dayAtt.courses && checkForMark(dayAtt.courses, lessonItem)})} key={userItem.id + '_' + dayItem + '_' + lessonItem.course + index}>
                <div className="adminAttendance__check-title">
                    { foundCourse?.name[lang] ? foundCourse?.name[lang] : foundCourse?.name['ua'] }
                </div>
                <div className="adminAttendance__check-time">
                    { lessonItem.time.start } - { lessonItem.time.end }
                </div>
                {/*
                  <AdminAttendanceRadioHolderStyled>
                    <AdminAttendanceRadioStyled>
                      <i class="fa-regular fa-circle" />
                      <i class="fa-regular fa-circle-check" />
                      <i class="fa-regular fa-circle-xmark" />
                    </AdminAttendanceRadioStyled>
                    <AdminAttendanceRadioStyled>
                    </AdminAttendanceRadioStyled>
                  </AdminAttendanceRadioHolderStyled>
                */}
                {<div className={classNames('adminAttendance__check-inner')} onClick={() => addAttendance(userItem.id, dayItem, lessonItem.course, lessonItem.time.start)}>
                    <div className="adminAttendance__check-icon">
                        {
                            dayAtt && dayAtt.courses && checkForMark(dayAtt.courses, lessonItem) ?
                                <i className="content_title-icon far fa-check-square" />
                                :
                                <i className="content_title-icon far fa-square" />
                        }
                    </div>
                    <div className="adminAttendance__check-label">
                        { translate('attended') }
                    </div>
                </div>
                }
                <div className={classNames('adminAttendance__mark-input form', {isFilled: dayAtt && dayAtt.courses && checkForMark(dayAtt.courses, lessonItem) && checkForMark(dayAtt.courses, lessonItem).mark})}>
                    <input type="number" min={0} max={12} className="form__field" placeholder={translate('score')} value={dayAtt && dayAtt.courses && checkForMark(dayAtt.courses, lessonItem) ? checkForMark(dayAtt.courses, lessonItem).mark ? checkForMark(dayAtt.courses, lessonItem).mark : '' : ''} onChange={handleMarkChange(userItem.id, dayItem, lessonItem.course, lessonItem.time.start)} />
                </div>
            </div>
        )
    }, [coursesList, addAttendance, lang, isWeekend, checkForMark, handleMarkChange, translate, user, showOnlyMy]);

    const _renderCells = useCallback((dayItem, dayLessons, userItem) => {
        const userAtt = userItem.attendance;
        let dayAtt = null;

        if ( userAtt ) {
            dayAtt = userAtt.find(item => item.day === moment(dayItem * 1000).format('DD_MMMM_YYYY'));
        }

        return (
            <td className="table__body-cell" key={dayItem}>
                {
                    orderBy(dayLessons, v => v.time.start).map((lessonItem, index) => _renderMark(lessonItem, index, dayAtt, dayItem, userItem))
                }
            </td>
        )
    }, [_renderMark]);

    const _renderRow = useCallback((userItem, classSchedule) => {
        const daysNames = {
            'monday': 'пн',
            'tuesday': 'вт',
            'wednesday': 'ср',
            'thursday': 'чт',
            'friday': 'пт',
            'saturday': 'сб',
            'sunday': 'нд'
        };

        return (
            <tr className="table__body-row" key={userItem.id} title={userItem.name}>
                <td className="table__body-cell">
                    <div className="adminAttendance__user">
                        { userItem.name }
                    </div>
                </td>
                {
                    days ?
                        days.map(dayItem => _renderCells(dayItem, classSchedule.find(scheduleItem => daysNames[scheduleItem.title] === moment(dayItem * 1000).format('dd')).lessons, userItem))
                        :
                        null
                }
            </tr>
        )
    }, [days, _renderCells]);

    const _renderClass = useCallback((classItem) => {
        if ( user.role !== 'admin' && showOnlyMy && !classByTeacherSubjects(classItem.courses) ) {
            return null;
        }

        return (
            <Fragment key={classItem.id}>
                <tr className="table__body-row adminAttendance__classRow" title={classItem.title[lang] ? classItem.title[lang] : classItem.title['ua']}>
                    <td className="table__body-cell">
                        { classItem.title[lang] ? classItem.title[lang] : classItem.title['ua'] }
                    </td>
                    {
                        days ?
                            days.map(dayItem => <td className="table__body-cell" key={dayItem}/>)
                            :
                            null
                    }
                </tr>
                { filterUsers(classItem.id).map(userItem => _renderRow(userItem, classItem.schedule)) }
            </Fragment>
        )
    }, [days, _renderRow, filterUsers, lang, user, showOnlyMy, classByTeacherSubjects]);

    return (
        <div className="table__holder">
            <table className="table">
                <colgroup>
                    <col width="200"/>
                    {
                        days ?
                            days.map(dayItem => <col width="200" key={dayItem}/>)
                            :
                            null
                    }
                </colgroup>
                <thead className="table__head">
                <tr className="table__head-row">
                    <th className="table__head-cell">
                        <div className="adminAttendance__user"/>
                    </th>
                    {
                        days ?
                            days.map(dayItem => _renderHead(dayItem))
                            :
                            null
                    }
                </tr>
                </thead>
                <tbody className="table__body">
                {
                    list.map(classItem => _renderClass(classItem))
                }
                </tbody>
            </table>
            {
                usersLoading ?
                    <Preloader/>
                    :
                    null
            }
        </div>
    );
};

const mapStateToProps = state => {
    return {
        usersLoading: state.usersReducer.loading,
        usersList: state.usersReducer.usersList,
        coursesList: state.coursesReducer.coursesList,
        user: state.authReducer.currentUser
    }
};

export default connect(mapStateToProps)(AdminAttendanceTable);

const AdminAttendanceRadioHolderStyled = styled.div`

`;

const AdminAttendanceRadioStyled = styled.div`

`;
