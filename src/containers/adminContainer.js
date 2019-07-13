import { connect } from 'react-redux';
import Admin from '../pages/Admin/Admin';
import {fetchLevelCourses, fetchSchedule, fetchCourses, fetchCalendar} from "../redux/actions/scheduleActions";
import { fetchUsers } from '../redux/actions/usersActions';
import { fetchTranslations } from '../redux/actions/translationsActions';

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
    fetchTranslations: dispatch(fetchTranslations())
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin)