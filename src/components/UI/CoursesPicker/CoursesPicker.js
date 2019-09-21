import React, { useState, useContext } from 'react';
import {connect} from "react-redux";
import {fetchAllCourses} from "../../../redux/actions/coursesActions";
import {Preloader} from "../preloader";
import siteSettingsContext from "../../../context/siteSettingsContext";
import './coursesPicker.scss';
import classNames from 'classnames';

const Modal = React.lazy(() => import('../Modal/Modal'));

function CoursesPicker({selectedCourses, coursesList, loading, handleAddCourses, noControls}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ showSubjectsListModal, setShowSubjectListModal ] = useState(false);
    const [ initialSelectedList, setInitialSelectedList ] = useState(selectedCourses);
    const [ selectedList, setSelectedList ] = useState(selectedCourses);

    if ( initialSelectedList !==  selectedCourses ) {
        setInitialSelectedList(selectedCourses);
        setSelectedList(selectedCourses);
    }

    return (
        <div className="coursesPicker">
            {
                loading ?
                    <Preloader/>
                    :
                    coursesList && selectedCourses && JSON.parse(selectedCourses).length ?
                        <div className="coursesPicker__selectedList">
                            {
                                filterSelectedCourses().map(item => _renderSelectedCourse(item))
                            }
                        </div>
                        :
                        null
            }
            {
                coursesList && coursesList.length && !noControls ?
                    <div className="coursesPicker__add">
                        <span className="coursesPicker__add-btn" onClick={() => setShowSubjectListModal(true)}>
                            {
                                JSON.parse(selectedCourses).length ?
                                    <i className="fa fa-pencil-alt" />
                                    :
                                    <i className="fa fa-plus" />
                            }
                        </span>
                    </div>
                    :
                    null
            }
            {
                showSubjectsListModal ?
                    <Modal onHideModal={handleHideModal} heading={translate('add') + ' ' + translate('course')}>
                        <div className="coursesPicker__list">
                            {
                                coursesList && coursesList.length ?
                                    filterSubjects().map(subject => _renderSubject(subject))
                                    :
                                    <div className="nothingFound">
                                        { translate('nothing_found') }
                                    </div>
                            }
                        </div>
                        {
                            coursesList.length ?
                                <div className="coursesPicker__list-btn">
                                    <a href="/" className="btn btn_primary" onClick={e => onAddClasses(e)}>
                                        {
                                            JSON.parse(selectedCourses).length ?
                                                <>
                                                    <i className="content_title-icon fa fa-pencil-alt"/>
                                                    { translate('update') }
                                                </>
                                                :
                                                <>
                                                    <i className="content_title-icon fa fa-plus"/>
                                                    { translate('add') }
                                                </>
                                        }
                                    </a>
                                </div>
                                :
                                null
                        }
                    </Modal>
                    :
                    null
            }
        </div>
    );

    function _renderSubject(subject) {
        return (
            <div key={subject.id} className="coursesPicker__list-item">
                <i className="content_title-icon fa fa-folder-open"/>
                {
                    subject.name[lang] ? subject.name[lang] : subject.name['ua']
                }
                {
                    subject.coursesList.length ?
                        <div className="coursesPicker__list-coursesList">
                            {
                                subject.coursesList.map(course => _renderCourse(subject.id, course))
                            }
                        </div>
                        :
                        <div className="coursesPicker__list-coursesList-nothingFound">
                            <i className="content_title-icon fa fa-unlink"/>
                            { translate('nothing_found') }
                        </div>
                }
            </div>
        )
    }

    function _renderCourse(subjectID, course) {
        const parsedSelectedList = JSON.parse(selectedList);
        return (
            <div className={classNames('coursesPicker__list-coursesList-item', {selected: parsedSelectedList.some(item => item.subject === subjectID && item.course === course.id)})} key={course.id} onClick={() => toggleCourse(subjectID, course.id)}>                {
                parsedSelectedList.some(item => item.subject === subjectID && item.course === course.id) ?
                    <i className="content_title-icon far fa-check-square"/>
                    :
                    <i className="content_title-icon far fa-square"/>
            }
                {
                    course.name[lang] ? course.name[lang] : course.name['ua']
                }
            </div>
        )
    }

    function _renderSelectedCourse(course) {
        const currentSubject = coursesList.find(item => item.id === course.subject);
        const currentCourse = currentSubject.coursesList.find(item => item.id === course.course);

        if ( !currentCourse ) {
            quickRemoveCourse(course);
            return null;
        }

        return (
            <div className="coursesPicker__selectedList-item" key={course.course}>
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
                {
                    !noControls ?
                        <span className="coursesPicker__selectedList-item-remove" onClick={() => quickRemoveCourse(course)}>
                            <i className="fa fa-trash-alt" />
                        </span>
                        :
                        null
                }
            </div>
        )
    }

    function quickRemoveCourse(course) {
        const newSelectedList = JSON.parse(selectedList);

        newSelectedList.splice(newSelectedList.indexOf(newSelectedList.find(item => item.subject === course.subject && item.course === course.course)), 1);
        handleAddCourses(JSON.stringify(newSelectedList));
    }

    function filterSelectedCourses() {
        const currentSelectedCourses = JSON.parse(selectedCourses);

        return currentSelectedCourses.sort((a, b) => {
            if ( a.subject < b.subject ) {
                return -1;
            }
            else if ( a.subject > b.subject ) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }

    function filterSubjects() {
        return coursesList.sort((a, b) => {
            const aName = a.name[lang] ? a.name[lang] : a.name['ua'];
            const bName = b.name[lang] ? b.name[lang] : b.name['ua'];

            if ( aName < bName ) {
                return -1;
            }
            else if ( aName > bName ) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }

    function handleHideModal() {
        setShowSubjectListModal(false);
    }

    function toggleCourse(subjectID, courseID) {
        const newSelectedList = JSON.parse(selectedList);

        if ( newSelectedList.some(item => item.subject === subjectID && item.course === courseID) ) {
            newSelectedList.splice(newSelectedList.indexOf(newSelectedList.find(item => item.subject === subjectID && item.course === courseID)), 1);
        }
        else {
            newSelectedList.push({
                course: courseID,
                subject: subjectID
            });
        }

        setSelectedList(JSON.stringify(newSelectedList));
    }

    function onAddClasses(e) {
        e.preventDefault();

        setShowSubjectListModal(false);

        handleAddCourses(selectedList);
    }
}

const mapStateToProps = state => ({
    coursesList: state.coursesReducer.coursesList,
    loading: state.coursesReducer.loading
});
export default connect(mapStateToProps)(CoursesPicker);
