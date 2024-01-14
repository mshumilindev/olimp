import { connect } from "react-redux";
import Admin from "../pages/Admin/Admin";
import {
  fetchLevelCourses,
  fetchSchedule,
  fetchCourses,
  fetchCalendar,
} from "../redux/actions/scheduleActions";
import { fetchUsers } from "../redux/actions/usersActions";
import { fetchTranslations } from "../redux/actions/translationsActions";
import { fetchAllCourses } from "../redux/actions/coursesActions";
import { fetchClasses } from "../redux/actions/classesActions";
import { fetchSiteSettings } from "../redux/actions/siteSettingsActions";
import {
  fetchLibrary,
  fetchLibraryBooks,
} from "../redux/actions/libraryActions";
import {
  fetchEvents,
  fetchEventsOrganizer,
  fetchEventsParticipant,
} from "../redux/actions/eventsActions";

const mapStateToProps = (state) => ({
  loading: state.configReducer.loading,
  scheduleList: state.scheduleReducer.scheduleList,
  levelCoursesList: state.scheduleReducer.levelCoursesList,
  coursesList: state.scheduleReducer.coursesList,
  usersList: state.usersReducer.usersList,
  translationsList: state.usersReducer.translationsList,
});

const mapDispatchToProps = (dispatch) => ({
  fetchSchedule: dispatch(fetchSchedule()),
  fetchLevelCourses: dispatch(fetchLevelCourses()),
  fetchCourses: dispatch(fetchCourses()),
  fetchCalendar: dispatch(fetchCalendar()),
  fetchUsers: dispatch(fetchUsers()),
  fetchTranslations: dispatch(fetchTranslations()),
  fetchAllCourses: dispatch(fetchAllCourses()),
  fetchClasses: dispatch(fetchClasses()),
  fetchSiteSettings: dispatch(fetchSiteSettings()),
  fetchEvents: () => dispatch(fetchEvents()),
  fetchEventsOrganizer: (userID) => dispatch(fetchEventsOrganizer(userID)),
  fetchEventsParticipant: (userID) => dispatch(fetchEventsParticipant(userID)),
  fetchLibrary: dispatch(fetchLibrary()),
  fetchLibraryBooks: dispatch(fetchLibraryBooks()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
