import React from "react";
import { connect } from "react-redux";
import "./studentCourse.scss";
import { downloadDoc } from "../../redux/actions/libraryActions";
import { fetchModulesLessons } from "../../redux/actions/coursesActions";
import StudentCourseItem from "../../components/StudentCourse/StudentCourseItem";
import StudentCourseLesson from "../../components/StudentCourse/StudentCourseLesson";
import { useParams } from "react-router-dom";

function StudentCourse({ allCoursesList, usersList, textbook }) {
  const params = useParams();
  return params.lessonID ? (
    <StudentCourseLesson params={params} allCoursesList={allCoursesList} />
  ) : (
    <StudentCourseItem
      allCoursesList={allCoursesList}
      params={params}
      textbook={textbook}
      usersList={usersList}
    />
  );
}

const mapStateToProps = (state) => ({
  allCoursesList: state.coursesReducer.coursesList,
  usersList: state.usersReducer.usersList,
  textbook: state.libraryReducer.textbook,
});
const mapDispatchToProps = (dispatch) => ({
  downloadDoc: (ref) => dispatch(downloadDoc(ref)),
  fetchModulesLessons: (subjectID, courseID) =>
    dispatch(fetchModulesLessons(subjectID, courseID)),
});
export default connect(mapStateToProps, mapDispatchToProps)(StudentCourse);
