import { connect } from 'react-redux';
import {fetchLevelCourses, fetchSchedule, fetchCourses, fetchCalendar} from "../redux/actions/scheduleActions";
import Layout from '../pages/layout';
import {fetchUsers} from "../redux/actions/usersActions";
import {fetchTranslations} from "../redux/actions/translationsActions";
import {fetchAllCourses} from "../redux/actions/coursesActions";
import {fetchClasses} from "../redux/actions/classesActions";
import {fetchSiteSettings} from "../redux/actions/siteSettingsActions";
import {fetchEvents} from "../redux/actions/eventsActions";

const mapStateToProps = state => ({
    loading: state.configReducer.loading,
    scheduleList: state.scheduleReducer.scheduleList,
    levelCoursesList: state.scheduleReducer.levelCoursesList,
    coursesList: state.scheduleReducer.coursesList,
    usersList: state.usersReducer.usersList,
    translationsList: state.usersReducer.translationsList,
    events: state.eventsReducer.events
});

const mapDispatchToProps = dispatch => ({
    fetchSchedule: dispatch(fetchSchedule()),
    fetchLevelCourses: dispatch(fetchLevelCourses()),
    fetchCourses: dispatch(fetchCourses()),
    fetchCalendar: dispatch(fetchCalendar()),
    fetchUsers: dispatch(fetchUsers()),
    fetchTranslations: dispatch(fetchTranslations()),
    fetchAllCourses: dispatch(fetchAllCourses()),
    fetchClasses: dispatch(fetchClasses()),
    fetchSiteSettings: dispatch(fetchSiteSettings()),
    fetchEvents: (userID) => dispatch(fetchEvents(userID))
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout)