import React, { useContext, useState, useEffect } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import {connect} from "react-redux";
import StudentCoursesItem from '../../components/StudentCourses/StudentCoursesItem';
import {Preloader} from "../../components/UI/preloader";
import userContext from "../../context/userContext";
import { Link } from 'react-router-dom';

function StudentCourses({classesList, allCoursesList}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);
    const [ currentClass, setCurrentClass ] = useState(null);

    useEffect(() => {
        if ( classesList && allCoursesList ) {
            setCurrentClass(classesList.find(item => item.id === user.class));
        }
    }, [classesList, allCoursesList]);

    return (
        <div className="studentCourses">
            <div className="content__title-holder">
                <h2 className="content__title">
                    <i className="content_title-icon fa fa-book" />
                    { translate('courses') }
                </h2>
            </div>
            <div className="studentCourses__list">
                {
                    classesList && allCoursesList ?
                        classesList.length && allCoursesList.length ?
                            <>
                                { filterCourses().map(item => _renderCourse(item)) }
                            </>
                            :
                            <div className="nothingFound">
                                { translate('nothing_found') }
                            </div>
                        :
                        <Preloader/>
                }
            </div>
        </div>
    );

    function _renderCourse(item) {
        return (
            <div className="block studentCourses__list-item" key={item.course.id}>
                <h2 className="block__heading">
                    <Link to={'/courses/' + item.subject.id + '/' + item.course.id}>
                        <span className="block__heading-subheading">
                            { item.subject.name[lang] ? item.subject.name[lang] : item.subject.name['ua'] }
                        </span>
                        { item.course.name[lang] ? item.course.name[lang] : item.course.name['ua'] }
                    </Link>
                </h2>
                <StudentCoursesItem subjectID={item.subject.id} courseID={item.course.id} />
            </div>
        )
    }

    function filterCourses() {
        const selectedCourses = [];

        if ( currentClass ) {
            currentClass.courses.forEach(item => {
                const selectedSubject = allCoursesList.find(subject => subject.id === item.subject);
                const selectedCourse = selectedSubject.coursesList.find(course => course.id === item.course);

                selectedCourses.push({
                    subject: selectedSubject,
                    course: selectedCourse
                });
            });
        }

        return selectedCourses;
    }
}
const mapStateToProps = state => ({
    classesList: state.classesReducer.classesList,
    allCoursesList: state.coursesReducer.coursesList
});

export default connect(mapStateToProps)(StudentCourses);
