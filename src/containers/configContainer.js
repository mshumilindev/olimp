import { connect } from "react-redux";
import {
  fetchLevelCourses,
  fetchSchedule,
  fetchCourses,
  fetchCalendar,
} from "../redux/actions/scheduleActions";
import Layout from "../pages/layout";
import { fetchUsers } from "../redux/actions/usersActions";
import { fetchTranslations } from "../redux/actions/translationsActions";
import { fetchAllCourses } from "../redux/actions/coursesActions";
import { fetchSiteSettings } from "../redux/actions/siteSettingsActions";
import { fetchLibrary } from "../redux/actions/libraryActions";

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
  fetchSiteSettings: dispatch(fetchSiteSettings()),
  fetchLibrary: dispatch(fetchLibrary()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
