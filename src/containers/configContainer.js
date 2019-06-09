import { connect } from 'react-redux';
import { fetchNav } from '../redux/actions/configActions';
import {fetchLevelCourses, fetchSchedule, fetchCourses, fetchCalendar} from "../redux/actions/scheduleActions";
import Layout from '../pages/layout';

const mapStateToProps = state => ({
    nav: state.configReducer.nav,
    loading: state.configReducer.loading,
    scheduleList: state.scheduleReducer.scheduleList,
    levelCoursesList: state.scheduleReducer.levelCoursesList,
    coursesList: state.scheduleReducer.coursesList
});

const mapDispatchToProps = dispatch => ({
    fetchNav: dispatch(fetchNav()),
    fetchSchedule: dispatch(fetchSchedule()),
    fetchLevelCourses: dispatch(fetchLevelCourses()),
    fetchCourses: dispatch(fetchCourses()),
    fetchCalendar: dispatch(fetchCalendar())
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout)