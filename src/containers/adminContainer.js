import { connect } from 'react-redux';
import Admin from '../pages/Admin/Admin';
import {fetchLevelCourses, fetchSchedule, fetchCourses, fetchCalendar} from "../redux/actions/scheduleActions";
import { fetchUsers } from '../redux/actions/usersActions';
import { fetchTranslations } from '../redux/actions/translationsActions';
import {fetchAllCourses} from "../redux/actions/coursesActions";
import {fetchClasses} from "../redux/actions/classesActions";
import {fetchSiteSettings} from "../redux/actions/siteSettingsActions";
import { fetchEvents } from '../redux/actions/eventsActions';

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
    fetchEvents: (userID, userRole) => dispatch(fetchEvents(userID, userRole))
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin)