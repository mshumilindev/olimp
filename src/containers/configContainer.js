import { connect } from 'react-redux';
import {fetchLevelCourses, fetchSchedule, fetchCourses, fetchCalendar} from "../redux/actions/scheduleActions";
import Layout from '../pages/layout';
import {fetchUsers} from "../redux/actions/usersActions";
import {fetchTranslations} from "../redux/actions/translationsActions";
import {fetchAllCourses} from "../redux/actions/coursesActions";
import {fetchClasses} from "../redux/actions/classesActions";
import {fetchSiteSettings} from "../redux/actions/siteSettingsActions";
import {fetchEventsParticipant} from "../redux/actions/eventsActions";
import {fetchLibrary} from "../redux/actions/libraryActions";
import {fetchNotifications} from "../redux/actions/notificationsActions";
import {fetchTests} from "../redux/actions/testsActions";

const mapStateToProps = state => ({
    loading: state.configReducer.loading,
    scheduleList: state.scheduleReducer.scheduleList,
    levelCoursesList: state.scheduleReducer.levelCoursesList,
    coursesList: state.scheduleReducer.coursesList,
    usersList: state.usersReducer.usersList,
    translationsList: state.usersReducer.translationsList
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
    fetchLibrary: dispatch(fetchLibrary()),
    fetchEventsParticipant: (userID, date) => dispatch(fetchEventsParticipant(userID, date)),
    fetchNotifications: dispatch(fetchNotifications()),
    fetchTests: dispatch(fetchTests())
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout)