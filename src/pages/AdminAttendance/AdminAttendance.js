import React, {Fragment, useContext, useEffect, useState} from 'react';
import {Preloader} from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import withFilters from "../../utils/withFilters";
import moment from "moment";
import 'moment/locale/uk';
import { connect } from 'react-redux';
import {orderBy} from "natural-orderby";
import './adminAttendance.scss';
import classNames from 'classnames';

moment.locale('uk');

function AdminAttendance({filters, selectedClass, filterByDate, usersList, loading, classesList, coursesList}) {
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
    }, [period]);

    console.log(coursesList);

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
                            classesList && filterClassesList().length ?
                                <div className="table__holder">
                                    <table className="table">
                                        <colgroup>
                                            <col width="200"/>
                                            {
                                                days ?
                                                    days.map(dayItem => <col width="60" key={dayItem}/>)
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
                                                filterClassesList().map(classItem => {
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
                                                            { filterUsers(classItem.id).map(userItem => _renderRow(userItem)) }
                                                        </Fragment>
                                                    )
                                                })
                                            }
                                            {/*{ filterUsers().map(userItem => _renderRow(userItem)) }*/}
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

    function _renderHead(dayItem) {
        return (
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
        )
    }

    function _renderRow(userItem) {
        return (
            <tr className="table__body-row" key={userItem.id} title={userItem.name}>
                <td className="table__body-cell">
                    <div className="adminAttendance__user">
                        { userItem.name }
                    </div>
                </td>
                {
                    days ?
                        days.map(dayItem => _renderCells(dayItem))
                        :
                        null
                }
            </tr>
        )
    }

    function _renderCells(dayItem) {
        return (
            <td className="table__body-cell" key={dayItem}>
                <div className={classNames('adminAttendance__check', {isWeekend: isWeekend(dayItem)})}>
                    <i className="far fa-square" />
                </div>
            </td>
        )
    }

    function isWeekend(day) {
        return moment(day * 1000).format('dd') === 'сб' || moment(day * 1000).format('dd') === 'нд';
    }

    function filterClassesList() {
        return orderBy(classesList, v => v.title[lang] ? v.title[lang] : v.title['ua']).filter(classItem => selectedClass ? classItem.id === selectedClass : true);
    }

    function filterUsers(classItem) {
        return orderBy(usersList, v => v.name)
                    .filter(userItem => userItem.role === 'student')
                    .filter(userItem => userItem.class === classItem);
    }
}

const mapStateToProps = state => {
    return {
        loading: state.usersReducer.loading,
        usersList: state.usersReducer.usersList,
        classesList: state.classesReducer.classesList,
        coursesList: state.coursesReducer.coursesList
    }
};

export default connect(mapStateToProps)(withFilters(AdminAttendance, null, null, null, null, null, true, true));