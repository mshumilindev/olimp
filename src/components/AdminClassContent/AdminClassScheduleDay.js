import React, { useContext, useState } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import {fetchAllCourses} from "../../redux/actions/coursesActions";
import {connect} from "react-redux";
import Preloader from "../UI/preloader";
import AdminClassScheduleDayCourse from "./AdminClassScheduleDayCourse";
import AdminClassScheduleDayLesson from "./AdminClassScheduleDayLesson";

const Modal = React.lazy(() => import('../UI/Modal/Modal'));

function AdminClassScheduleDay({canEdit, day, selectedCourses, coursesList, handleAddSchedule}) {
    const { translate } = useContext(siteSettingsContext);
    const [ showAddModal, setShowAddModal ] = useState(false);
    const [ selectedLessons, setSelectedLessons ] = useState(JSON.stringify([]));

    if ( day.lessons.length ) {
        day.lessons.forEach(item => {
            const currentLesson = selectedCourses.some(course => course.subject === item.subject && course.course === item.course);

            if ( !currentLesson ) {
                quickRemoveLesson(item);
            }
        });
    }

    return (
        <div className="adminClass__schedule-item">
            <div className="adminClass__schedule-item-day">
                { translate(day.title) }
            </div>
            <div className="coursesPicker__selectedList">
                {
                    coursesList && day.lessons.length && coursesList.length ?
                        day.lessons.sort((a, b) => {
                            if ( a.time && b.time ) {
                                if ( a.time.start < b.time.start ) {
                                    return -1;
                                }
                                else if ( a.time.start > b.time.start ) {
                                    return 1;
                                }
                                else {
                                    return 0;
                                }
                            }
                            return 0;
                        }).map((lesson, index) => <AdminClassScheduleDayLesson lesson={lesson} index={index} coursesList={coursesList} quickRemoveLesson={quickRemoveLesson} key={index + lesson.course} canEdit={canEdit} />)
                        :
                        null
                }
            </div>
            {
                canEdit() ?
                    <div className="adminClass__schedule-item-add" onClick={() => setShowAddModal(true)}>
                        <i className="fa fa-plus" />
                    </div>
                    :
                    null
            }
            {
                showAddModal ?
                    <Modal onHideModal={handleHideModal} heading={translate('add') + ' ' + translate('course')}>
                        {
                            coursesList && coursesList.length ?
                                <div className="adminClass__schedule-courses">
                                    {
                                        selectedCourses.sort((a, b) => {
                                            if ( a.subject < b.subject ) {
                                                return -1;
                                            }
                                            else if ( a.subject > b.subject ) {
                                                return 1;
                                            }
                                            else {
                                                return 0;
                                            }
                                        }).map(item => <AdminClassScheduleDayCourse item={item} selectedLessons={selectedLessons} coursesList={coursesList} setSelectedLessons={setSelectedLessons} key={item.course} />)
                                    }
                                </div>
                                :
                                <Preloader/>
                        }
                        <div className="adminClass__schedule-btn">
                            <a href="/" className="btn btn_primary" onClick={e => onAddLessons(e)}>
                                <i className="content_title-icon fa fa-plus"/>
                                { translate('add') }
                            </a>
                        </div>
                    </Modal>
                    :
                    null
            }
        </div>
    );

    function quickRemoveLesson(lesson) {
        const newSelectedLessons = day.lessons;

        newSelectedLessons.splice(newSelectedLessons.indexOf(newSelectedLessons.find(newItem => newItem.subject === lesson.subject && newItem.course === lesson.course && newItem.time === lesson.time)), 1);

        handleAddSchedule({
            ...day,
            lessons: [
                ...newSelectedLessons
            ]
        });
    }

    function handleHideModal() {
        setShowAddModal(false);
    }

    function onAddLessons(e) {
        e.preventDefault();

        setShowAddModal(false);
        handleAddSchedule({
            ...day,
            lessons: [
                ...day.lessons,
                ...JSON.parse(selectedLessons)
            ]
        });
        setSelectedLessons(JSON.stringify([]));
    }
}
const mapStateToProps = state => ({
    coursesList: state.coursesReducer.coursesList,
    loading: state.coursesReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchAllCourses: dispatch(fetchAllCourses())
});
export default connect(mapStateToProps, mapDispatchToProps)(AdminClassScheduleDay);
