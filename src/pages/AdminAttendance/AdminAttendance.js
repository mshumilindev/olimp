import React, {useCallback, useContext, useEffect, useState} from 'react';
import Preloader from "../../components/UI/preloader";
import { updateUser } from '../../redux/actions/usersActions';
import siteSettingsContext from "../../context/siteSettingsContext";
import withFilters from "../../utils/withFilters";
import moment from "moment";
import 'moment/locale/uk';
import { connect } from 'react-redux';
import {orderBy} from "natural-orderby";
import './adminAttendance.scss';
import AdminAttendanceTable from "../../components/AdminAttendanceTable/AdminAttendanceTable";
moment.locale('uk');

function AdminAttendance({filters, selectedClass, filterByDate, classesList, coursesList, updateUser, showOnlyMy, coursesLoading, classesLoading}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ period, setPeriod ] = useState(null);

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

    const filterClassesList = useCallback(() => orderBy(classesList, v => v.title[lang] ? v.title[lang] : v.title['ua']).filter(classItem => selectedClass ? classItem.id === selectedClass : true), [classesList, lang, selectedClass]);

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
                        coursesLoading || classesLoading ?
                            <Preloader/>
                            :
                            classesList && coursesList && filterClassesList().length ?
                                <AdminAttendanceTable
                                    filterByDate={filterByDate}
                                    updateUser={updateUser}
                                    showOnlyMy={showOnlyMy}
                                    list={filterClassesList()}
                                />
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
        coursesLoading: state.coursesReducer.loading,
        classesLoading: state.classesReducer.loading,
        classesList: state.classesReducer.classesList,
        coursesList: state.coursesReducer.coursesList
    }
};

const mapDispatchToProps = dispatch => ({
    updateUser: (userID, updatedFields) => dispatch(updateUser(userID, updatedFields))
});

export default connect(mapStateToProps, mapDispatchToProps)(withFilters(AdminAttendance, null, null, null, null, 'teacher', true, true));