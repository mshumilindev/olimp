import React, { useContext, useState } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import {fetchAllCourses} from "../../redux/actions/coursesActions";
import {connect} from "react-redux";
import {Preloader} from "../UI/preloader";
import classNames from 'classnames';

const Modal = React.lazy(() => import('../UI/Modal/Modal'));

function AdminClassScheduleDay({day, selectedCourses, coursesList, handleAddSchedule}) {
    const { translate, lang } = useContext(siteSettingsContext);
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
                    day.lessons.length && coursesList.length ?
                        day.lessons.sort((a, b) => {
                            if ( a.subject < b.subject ) {
                                return -1;
                            }
                            else if ( a.subject > b.subject ) {
                                return 1;
                            }
                            else {
                                return 0;
                            }
                        }).map((lesson, index) => _renderLesson(lesson, index))
                        :
                        null
                }
            </div>
            <div className="adminClass__schedule-item-add" onClick={() => setShowAddModal(true)}>
                <i className="fa fa-plus" />
            </div>
            {
                showAddModal ?
                    <Modal onHideModal={handleHideModal} heading={translate('add') + ' ' + translate('course')}>
                        {
                            coursesList.length ?
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
                                        }).map(item => _renderCourse(item))
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

    function _renderLesson(lesson, index) {
        const currentSubject = coursesList.find(subject => subject.id === lesson.subject);
        const currentCourse = currentSubject.coursesList.find(course => course.id === lesson.course);

        return (
            <div key={index + lesson.course} className="coursesPicker__selectedList-item" onClick={() => quickRemoveLesson(lesson)}>
                <div className="coursesPicker__selectedList-item-subject">
                    {
                        currentSubject.name[lang] ? currentSubject.name[lang] : currentSubject.name['ua']
                    }
                </div>
                <div className="coursesPicker__selectedList-item-course">
                    {
                        currentCourse.name[lang] ? currentCourse.name[lang] : currentCourse.name['ua']
                    }
                </div>
                <span className="coursesPicker__selectedList-item-remove">
                    <i className="fa fa-trash-alt"/>
                </span>
            </div>
        )
    }

    function _renderCourse(item) {
        const currentSubject = coursesList.find(subject => subject.id === item.subject);
        const currentCourse = currentSubject.coursesList.find(course => course.id === item.course);

        return (
            <div className={classNames('adminClass__schedule-courses-item', {selected: JSON.parse(selectedLessons).some(lesson => lesson.subject === item.subject && lesson.course === item.course)})} key={item.course} onClick={() => toggleLesson(item)}>
                {
                    JSON.parse(selectedLessons).some(lesson => lesson.subject === item.subject && lesson.course === item.course) ?
                        <i className="content_title-icon far fa-check-square" />
                        :
                        <i className="content_title-icon far fa-square" />
                }
                <div className="adminClass__schedule-courses-item-subject">
                    {
                        currentSubject.name[lang] ? currentSubject.name[lang] : currentSubject.name['ua']
                    }
                </div>
                <div className="adminClass__schedule-courses-item-course">
                    {
                        currentCourse.name[lang] ? currentCourse.name[lang] : currentCourse.name['ua']
                    }
                </div>
            </div>
        )
    }

    function quickRemoveLesson(lesson) {
        const newSelectedLessons = day.lessons;

        newSelectedLessons.splice(newSelectedLessons.indexOf(newSelectedLessons.find(newItem => newItem.subject === lesson.subject && newItem.course === lesson.course)), 1);

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

    function toggleLesson(item) {
        const newSelectedLessons = JSON.parse(selectedLessons);

        if ( newSelectedLessons.some(newItem => newItem.subject === item.subject && newItem.course === item.course) ) {
            newSelectedLessons.splice(newSelectedLessons.indexOf(newSelectedLessons.find(newItem => newItem.subject === item.subject && newItem.course === item.course)), 1);
        }
        else {
            newSelectedLessons.push(item);
        }
        setSelectedLessons(JSON.stringify(newSelectedLessons));
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
