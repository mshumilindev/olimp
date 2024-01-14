import React, { useContext, useState } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import {connect} from "react-redux";
import StudentCoursesItem from '../../components/StudentCourses/StudentCoursesItem';
import Preloader from "../../components/UI/preloader";
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import './studentCourses.scss';
import Notifications from "../../components/Notifications/Notifications";

function StudentCourses({classData, allCoursesList}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ showIndex, setShowIndex ] = useState(false);

    return (
        <div className={classNames('studentCourses', {blurred: showIndex})}>
            <div className="content__title-holder">
                <h2 className="content__title">
                    <i className="content_title-icon fa fa-book" />
                    { translate('courses') }
                </h2>
            </div>
            <Notifications/>
            <div className="studentCourses__list">
                {
                    classData && allCoursesList ?
                        allCoursesList.length ?
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
            {
                classData && allCoursesList && allCoursesList.length && filterCourses().length > 1 ?
                    _renderIndex()
                    :
                    null
            }
        </div>
    );

    function _renderCourse(item) {
      if ( !item?.subject || !item?.course ) {
        return null
      }

        return (
            <div className="block studentCourses__list-item" key={item.course.id} id={item.course.id}>
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

    function _renderIndex() {
        return (
            <div className={classNames('alphabetIndex', {show: showIndex})}>
                <span className="alphabetIndex__btn" onClick={() => setShowIndex(!showIndex)}>
                    {
                        !showIndex ?
                            <i className="fas fa-ellipsis-h" />
                            :
                            <i className="fa fa-times" />
                    }
                </span>
                <div className="alphabetIndex__list">
                    {
                        filterCourses().map((item) => {
                            if ( !item?.course ) {
                              return null;
                            }
                            return (
                                <div className="alphabetIndex__item" key={item.course.id} onClick={() => scrollTo(item.course.id)}>
                                    { item.course.name[lang] ? item.course.name[lang] : item.course.name['ua'] }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    function scrollTo(id) {
        const block = document.getElementById(id);
        const header = document.querySelector('.studentHeader');

        window.scrollTo({top: window.scrollY + block.getBoundingClientRect().top - header.offsetHeight - 40, behavior: 'smooth'});
        setShowIndex(false);
    }

    function filterCourses() {
        const selectedCourses = [];

        if ( classData ) {
            classData.courses.forEach(item => {
                const selectedSubject = allCoursesList.find(subject => subject.id === item.subject);
                if ( !selectedSubject ) {
                  return null;
                }
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
    classData: state.classesReducer.classData,
    allCoursesList: state.coursesReducer.coursesList
});

export default connect(mapStateToProps)(StudentCourses);
