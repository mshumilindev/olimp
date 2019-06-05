import { connect } from 'react-redux';
import {fetchLevelCourses, fetchSchedule} from '../redux/actions/scheduleActions';
import EventsCalendar from '../components/EventsCalendar/EventsCalendar';

const getLevelCoursesList = (state) => {
    return state;
};

const mapStateToProps = state => ({
    scheduleList: getLevelCoursesList(state.scheduleList),
    loading: getLevelCoursesList(state.loading)
});

const mapDispatchToProps = dispatch => ({
    fetchSchedule: dispatch(fetchSchedule()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsCalendar)
