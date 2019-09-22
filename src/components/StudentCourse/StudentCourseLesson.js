import React, { useContext, useEffect, useState } from 'react';
import './studentLesson.scss';
import {fetchLesson} from "../../redux/actions/coursesActions";
import {connect} from "react-redux";
import {Preloader} from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import Article from '../Article/Article';

function StudentCourseLesson({params, lesson, fetchLesson, allCoursesList}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ currentCourse, setCurrentCourse ] = useState(null);

    useEffect(() => {
        if ( allCoursesList ) {
            const selectedSubject = allCoursesList.find(subject => subject.id === params.subjectID);
            const selectedCourse = selectedSubject.coursesList.find(course => course.id === params.courseID);

            setCurrentCourse({
                subject: selectedSubject,
                course: selectedCourse
            });

        }
    }, [allCoursesList, params.courseID, params.subjectID]);

    useEffect(() => {
        fetchLesson(params.subjectID, params.courseID, params.moduleID, params.lessonID);
    }, [params]);

    return (
        <div className="studentLesson">
            <div className="content__title-holder">
                <h2 className="content__title">
                    <i className="content_title-icon fa fa-paragraph" />
                    {
                        lesson && currentCourse ?
                            <>
                                <div className="content__title-subtitle">
                                    {
                                        currentCourse.subject.name[lang] ?
                                            currentCourse.subject.name[lang]
                                            :
                                            currentCourse.subject.name['ua']
                                    }
                                </div>
                                {
                                    lesson.name[lang] ?
                                        lesson.name[lang]
                                        :
                                        lesson.name['ua']
                                }
                            </>
                            :
                            translate('lesson')
                    }
                </h2>
            </div>
            {
                !lesson ?
                    <Preloader/>
                    :
                    _renderLesson()
            }
        </div>
    );

    function _renderLesson() {
        return (
            <>
                <Article content={lesson['content']} />
            </>
        )
    }
}

const mapStateToProps = state => ({
    lesson: state.coursesReducer.lesson,
    loading: state.coursesReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchLesson: (subjectID, courseID, moduleID, lessonID) => dispatch(fetchLesson(subjectID, courseID, moduleID, lessonID))
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentCourseLesson);
