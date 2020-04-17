import React, { useContext, useEffect, useState } from 'react';
import './studentLesson.scss';
import {fetchLesson, discardLesson} from "../../redux/actions/coursesActions";
import {connect} from "react-redux";
import {Preloader} from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import Article from '../Article/Article';
import userContext from "../../context/userContext";
import { Link } from 'react-router-dom';
import {updateTest} from "../../redux/actions/testsActions";

function StudentCourseLesson({params, lesson, fetchLesson, allCoursesList, userLoading, discardLesson, tests, updateTest}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);
    const [ currentCourse, setCurrentCourse ] = useState(null);
    const [ startQuestions, setStartQuestions ] = useState(false);
    const [ currentUser, setCurrentUser ] = useState(null);

    useEffect(() => {
        return () => {
            setCurrentCourse(null);
            discardLesson();
        }
    }, []);

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

    useEffect(() => {
        if ( !currentUser ) {
            setCurrentUser(JSON.stringify(user));
        }
    }, [user]);

    useEffect(() => {
        setStartQuestions(false);
    }, [currentUser]);

    return (
        <div className="studentLesson">
            <div className="content__title-holder">
                <h2 className="content__title">
                    <i className="content_title-icon fa fa-paragraph" />
                    <div className="content__title-inner">
                        {
                            lesson && currentCourse ?
                                <>
                                    <span className="content__title-subtitle">
                                        <Link to={'/courses/' + currentCourse.subject.id + '/' + currentCourse.course.id}>
                                            {
                                                currentCourse.course.name[lang] ?
                                                    currentCourse.course.name[lang]
                                                    :
                                                    currentCourse.course.name['ua']
                                            }
                                        </Link>
                                    </span>
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
                    </div>
                </h2>
                {
                    lesson && lesson.QA.length && !startQuestions ?
                        !getTest() ?
                            <div className="content__title-actions">
                                <a href="/" className="btn btn_primary" onClick={e => handleStartQuestions(e)}>
                                    { translate('start_quiz') }
                                </a>
                            </div>
                            :
                            getTest().score ?
                                <div className="content__title-actions">
                                    <div className="studentLesson__score">
                                        <div className="studentLesson__score-item">
                                            <div>{ translate('score') }</div>
                                            <div className="studentLesson__score-num">{ getTest().score }</div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="content__title-actions">
                                    <div className="studentLesson__score">
                                        <div className="studentLesson__score-item">
                                            <i className="fas fa-hourglass-half" />
                                        </div>
                                    </div>
                                </div>
                        :
                        null
                }
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
                {
                    !startQuestions ?
                        <Article content={lesson['content']} type={'content'} />
                        :
                        null
                }
                {
                    lesson.QA.length && startQuestions ?
                        <Article content={lesson['QA']} type={'questions'} finishQuestions={finishQuestions} loading={userLoading}/>
                        :
                        null
                }
            </>
        )
    }

    function handleStartQuestions(e) {
        e.preventDefault();

        setStartQuestions(true);
    }

    function finishQuestions(answers) {
        const newAnswers = {
            lesson: params,
            blocks: answers.blocks,
            userID: user.id
        };

        setStartQuestions(false);
        updateTest(newAnswers);
    }

    function getTest() {
        return tests.find(item => item.id === params.lessonID + '_' + user.id);
    }
}

const mapStateToProps = state => ({
    lesson: state.coursesReducer.lesson,
    loading: state.coursesReducer.loading,
    userLoading: state.usersReducer.loading,
    usersList: state.usersReducer.usersList,
    tests: state.testsReducer.tests
});
const mapDispatchToProps = dispatch => ({
    fetchLesson: (subjectID, courseID, moduleID, lessonID) => dispatch(fetchLesson(subjectID, courseID, moduleID, lessonID)),
    discardLesson: () => dispatch(discardLesson()),
    updateTest: (newTest) => dispatch(updateTest(newTest))
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentCourseLesson);
