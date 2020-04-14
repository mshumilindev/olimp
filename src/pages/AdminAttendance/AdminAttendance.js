import React, {useContext, useEffect, useState} from 'react';
import {Preloader} from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import withFilters from "../../utils/withFilters";
import moment from "moment";
import 'moment/locale/uk';
import { connect } from 'react-redux';
import {orderBy} from "natural-orderby";
import './adminAttendance.scss';

moment.locale('uk');

function AdminAttendance({filters, filterByDate, usersList, loading}) {
    const { translate } = useContext(siteSettingsContext);
    const [ period, setPeriod ] = useState(null);
    const [ days, setDays ] = useState(null);

    useEffect(() => {
        const startMonth = moment(filterByDate.start * 1000).format('DD MMMM');
        const startYear = moment(filterByDate.start * 1000).format('YYYY');
        const endMonth = moment(filterByDate.end * 1000).format('DD MMMM');
        const endYear = moment(filterByDate.end * 1000).format('YYYY');

        if ( startMonth === endMonth && startYear === endYear ) {
            setPeriod(startMonth + ' ' + startYear);
        }
        else {
            if ( startYear === endYear ) {
                setPeriod(startMonth + ' - ' + endMonth + ' ' + startYear);
            }
            else {
                setPeriod(startMonth + ' ' + startYear + ' - ' + endMonth + ' ' + endYear);
            }
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
                    <div className="table__holder">
                        {
                            loading ?
                                <Preloader/>
                                :
                                filterUsers().length && days ?
                                    <table className="table">
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
                                            { filterUsers().map(userItem => _renderRow(userItem)) }
                                        </tbody>
                                    </table>
                                    :
                                    null
                        }
                    </div>
                </div>
            </section>
        </div>
    );

    function _renderHead(dayItem) {
        return (
            <th className="table__head-cell">
                { moment(dayItem * 1000).format('DD.MM') }<br/>
                { moment(dayItem * 1000).format('YYYY') }
            </th>
        )
    }

    function _renderRow(userItem) {
        return (
            <tr className="table__body-row" key={userItem.id}>
                <td className="table__body-cell">
                    <div className="adminAttendance__user">
                        { userItem.name }
                    </div>
                </td>
            </tr>
        )
    }

    function filterUsers() {
        return orderBy(usersList, v => v.name).filter(userItem => userItem.role === 'student');
    }
}

const mapStateToProps = state => {
    return {
        loading: state.usersReducer.loading,
        usersList: state.usersReducer.usersList
    }
};

export default connect(mapStateToProps)(withFilters(AdminAttendance, null, null, null, null, null, null, true));