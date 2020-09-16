import React, { useContext, useEffect, useState } from 'react';
import './studentLesson.scss';
import {fetchLesson, discardLesson} from "../../redux/actions/coursesActions";
import {connect} from "react-redux";
import Preloader from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import Article from '../Article/Article';
import { Link } from 'react-router-dom';
import {updateTest} from "../../redux/actions/testsActions";

function StudentCourseLesson({user, params, lesson, loading, testsLoading, fetchLesson, allCoursesList, discardLesson, tests, updateTest}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ currentCourse, setCurrentCourse ] = useState(null);
    const [ startQuestions, setStartQuestions ] = useState(false);
    const [ answers, setAnswers ] = useState(null);
    const [ allAnswersGiven, setAllAnswersGiven ] = useState(false);

    useEffect(() => {
        return () => {
            setCurrentCourse(null);
            discardLesson();
        }
    }, []);

    useEffect(() => {
        if ( lesson && lesson['QA'] && !answers && tests ) {
            let blocks = [];

            if ( getTest() ) {
                blocks = Object.assign([], JSON.parse(JSON.stringify(getTest().blocks)));
            }

            setAnswers(Object.assign({}, {blocks: blocks}));
        }
    }, [lesson]);

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
                    !lesson || lesson.hideQA ?
                        null
                        :
                        lesson.QA.length && !startQuestions ?
                            !getTest() || !getTest().isSent ?
                                <div className="content__title-actions">
                                    <a href="/" className="btn btn_primary" onClick={e => handleStartQuestions(e)}>
                                        { translate('start_quiz') }
                                    </a>
                                </div>
                                :
                                getTest() && getTest().score ?
                                    <div className="content__title-actions">
                                        <div className="studentLesson__score" onClick={e => handleStartQuestions(e)}>
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
                            lesson && lesson.QA.length && (!getTest() || !getTest().score) ?
                                <div className="content__title-actions">
                                    <span className="btn btn_primary" disabled={!isTestUpdated()} onClick={saveProgress}>
                                        { translate('save') }
                                    </span>
                                </div>
                                :
                                null
                }
                {
                    loading || testsLoading ?
                        <Preloader size={50}/>
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
        const QABlocks = [];

        if ( lesson['QA'] ) {
            lesson['QA'].forEach(item => {
                if ( item.type !== 'answers' || !getTest() || !getTest().comments || !getTest().comments.find(comItem => comItem.id === 'comment_' + item.id) ) {
                    QABlocks.push(item);
                }
                else {
                    QABlocks.push(
                        item,
                        {
                            type: 'comment',
                            ...getTest().comments.find(comItem => comItem.id === 'comment_' + item.id)
                        }
                    );
                }
            });
        }

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
                        <Article content={QABlocks} type={'questions'} answers={answers} setAnswers={setAnswers} finishQuestions={finishQuestions} loading={loading} allAnswersGiven={allAnswersGiven} setAllAnswersGiven={setAllAnswersGiven} readonly={getTest() && getTest().score}/>
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

    function finishQuestions() {
        if ( allAnswersGiven ) {
            const newAnswers = {
                lesson: params,
                blocks: answers.blocks,
                userID: user.id,
                isSent: true
            };

            setStartQuestions(false);
            updateTest(newAnswers);
        }
    }

    function saveProgress() {
        if ( isTestUpdated() ) {
            const newAnswers = {
                lesson: params,
                blocks: answers.blocks,
                userID: user.id,
                isSent: false
            };

            updateTest(newAnswers);
        }
    }

    function getTest() {
        if ( !tests || !tests.length ) {
            return null;
        }
        return tests.find(item => item.lesson.subjectID === params.subjectID && item.lesson.courseID === params.courseID && item.lesson.moduleID === params.moduleID && item.lesson.lessonID === params.lessonID && item.userID === user.id);
    }

    function isTestUpdated() {
        return !getTest() || !getTest().blocks || JSON.stringify(getTest().blocks) !== JSON.stringify(answers.blocks);
    }
}

const mapStateToProps = state => ({
    lesson: state.coursesReducer.lesson,
    loading: state.coursesReducer.loading,
    tests: state.testsReducer.tests,
    testsLoading: state.testsReducer.loading,
    user: state.authReducer.currentUser
});
const mapDispatchToProps = dispatch => ({
    fetchLesson: (subjectID, courseID, moduleID, lessonID) => dispatch(fetchLesson(subjectID, courseID, moduleID, lessonID)),
    discardLesson: () => dispatch(discardLesson()),
    updateTest: (newTest) => dispatch(updateTest(newTest))
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentCourseLesson);
