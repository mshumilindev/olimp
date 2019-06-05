import { connect } from 'react-redux';
import { fetchSchedule, fetchLevelCourses } from '../redux/actions/scheduleActions';
import ScheduleList from '../components/schedule/scheduleList';

const getScheduleList = (state) => {
    return state;
};

const mapStateToProps = state => ({
    scheduleList: getScheduleList(state.scheduleList),
    levelCoursesList: getScheduleList(state.levelCoursesList),
    coursesList: getScheduleList(state.coursesList),
    loading: getScheduleList(state.loading)
});

const mapDispatchToProps = dispatch => ({
    fetchSchedule: dispatch(fetchSchedule()),
    fetchLevelCourses: dispatch(fetchLevelCourses())
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleList)
