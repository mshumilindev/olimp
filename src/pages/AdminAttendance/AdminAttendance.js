import React, {Fragment, useCallback, useContext, useEffect, useState} from 'react';
import Preloader from "../../components/UI/preloader";
import { updateUser } from '../../redux/actions/usersActions';
import siteSettingsContext from "../../context/siteSettingsContext";
import withFilters from "../../utils/withFilters";
import moment from "moment";
import 'moment/locale/uk';
import { connect } from 'react-redux';
import {orderBy} from "natural-orderby";
import './adminAttendance.scss';
import classNames from 'classnames';
moment.locale('uk');

function AdminAttendance({filters, selectedClass, filterByDate, usersList, loading, classesList, coursesList, updateUser}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ period, setPeriod ] = useState(null);
    const [ days, setDays ] = useState(null);

    useEffect(() => {
        const startMonth = moment(filterByDate.start * 1000).format('DD MMMM');
        const startYear = moment(filterByDate.start * 1000).format('YYYY');
        const endMonth = moment(filterByDate.end * 1000).format('DD MMMM');
        const endYear = moment(filterByDate.end * 1000).format('YYYY');

        if ( startYear === endYear ) {
            setPeriod(startMonth + ' - ' + endMonth + ' ' + startYear);
        }
        else {
            setPeriod(startMonth + ' ' + startYear + ' - ' + endMonth + ' ' + endYear);
        }
    }, [filterByDate]);

    useEffect(() => {
        let i = filterByDate.start - 86400;
        const days = [];

        while ( i < filterByDate.end ) {
            i += 86400;
            days.push(i);
        }

        setDays(days);
    }, [period, filterByDate.start, filterByDate.end, setDays]);

    const filterClassesList = useCallback(() => orderBy(classesList, v => v.title[lang] ? v.title[lang] : v.title['ua']).filter(classItem => selectedClass ? classItem.id === selectedClass : true), [classesList, lang, selectedClass]);

    const isWeekend = useCallback((day) => moment(day * 1000).format('dd') === 'сб' || moment(day * 1000).format('dd') === 'нд', []);

    const _renderHead = useCallback((dayItem) => (
        <th className="table__head-cell" key={dayItem}>
            <div className={classNames('adminAttendance__day', {isWeekend: isWeekend(dayItem)})}>
                <strong>
                    { moment(dayItem * 1000).format('dd') }
                    <br/>
                    <span>
                            { moment(dayItem * 1000).format('DD.MM') }
                        </span>
                </strong>
            </div>
        </th>
    ), [isWeekend]);

    const filterUsers = useCallback((classItem) => {
        return orderBy(usersList, v => v.name)
            .filter(userItem => userItem.role === 'student' && userItem.status === 'active')
            .filter(userItem => userItem.class === classItem);
    }, [usersList]);

    const addAttendance = useCallback((userID, dayItem, courseItem) => {
        const formattedDayItem = moment(dayItem * 1000).format('DD_MMMM_YYYY');
        const foundUser = usersList.find(userItem => userItem.id === userID);
        const attendance = foundUser.attendance || [];
        const attDayIndex = attendance.find(attItem => attItem.day === formattedDayItem) ? attendance.indexOf(attendance.find(attItem => attItem.day === formattedDayItem)) : attendance.length;
        const attDay = attendance.find(attItem => attItem.day === formattedDayItem) || {day: formattedDayItem, courses: []};

        if ( attDay.courses.indexOf(courseItem) !== -1 ) {
            attDay.courses = attDay.courses.filter(item => item !== courseItem);
        }
        else {
            attDay.courses.push(courseItem);
        }
        attendance[attDayIndex] = attDay;
        updateUser(userID, {attendance: attendance});
    }, [updateUser, usersList]);

    const _renderCells = useCallback((dayItem, dayLessons, userItem) => {
        const userAtt = userItem.attendance;
        let dayAtt = null;

        if ( userAtt ) {
            dayAtt = userAtt.find(item => item.day === moment(dayItem * 1000).format('DD_MMMM_YYYY'));
        }

        return (
            <td className="table__body-cell" key={dayItem}>
                {
                    orderBy(dayLessons, v => v.time.start).map((lessonItem, index) => {
                        const foundCourse = coursesList.find(subjectItem => subjectItem.id === lessonItem.subject).coursesList.find(courseItem => courseItem.id === lessonItem.course);

                        return (
                            <div className={classNames('adminAttendance__check', {isWeekend: isWeekend(dayItem)})} key={userItem.id + '_' + dayItem + '_' + lessonItem.course + index}>
                                <div className={classNames('adminAttendance__check-inner', {isChecked: dayAtt && dayAtt.courses && dayAtt.courses.indexOf(lessonItem.course) !== -1})} onClick={() => addAttendance(userItem.id, dayItem, lessonItem.course)}>
                                    <div className="adminAttendance__check-icon">
                                        {
                                            dayAtt && dayAtt.courses && dayAtt.courses.indexOf(lessonItem.course) !== -1 ?
                                                <i className="content_title-icon far fa-check-square" />
                                                :
                                                <i className="content_title-icon far fa-square" />
                                        }
                                    </div>
                                    <div className="adminAttendance__check-title">
                                        { foundCourse.name[lang] ? foundCourse.name[lang] : foundCourse.name['ua'] }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </td>
        )
    }, [addAttendance, coursesList, lang, isWeekend]);

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

    const _renderClass = useCallback((classItem) => (
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
    ), [days, _renderRow, filterUsers, lang]);

    return (
        <div className="adminAttendance">
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className="content_title-icon fa fa-user-check" />
                        { translate('attendance') }
                    </h2>
                </div>
                { filters }
                <div className="widget">
                    <div className="widget__title" style={{textAlign: 'center'}}>
                        {
                            period ?
                                period.toUpperCase()
                                :
                                null
                        }
                    </div>
                    {
                        loading ?
                            <Preloader/>
                            :
                            classesList && coursesList && filterClassesList().length ?
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
                                                filterClassesList().map(classItem => _renderClass(classItem))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                :
                                null
                    }
                </div>
            </section>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        loading: state.usersReducer.loading,
        usersList: state.usersReducer.usersList,
        classesList: state.classesReducer.classesList,
        coursesList: state.coursesReducer.coursesList
    }
};

const mapDispatchToProps = dispatch => ({
    updateUser: (userID, updatedFields) => dispatch(updateUser(userID, updatedFields))
});

export default connect(mapStateToProps, mapDispatchToProps)(withFilters(AdminAttendance, null, null, null, null, null, true, true));