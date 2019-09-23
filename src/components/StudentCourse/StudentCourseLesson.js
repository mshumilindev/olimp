import React, { useContext, useEffect, useState } from 'react';
import './studentLesson.scss';
import {fetchLesson} from "../../redux/actions/coursesActions";
import {connect} from "react-redux";
import {Preloader} from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import Article from '../Article/Article';
import userContext from "../../context/userContext";
import {updateUser} from "../../redux/actions/usersActions";
import { Link } from 'react-router-dom';

function StudentCourseLesson({params, lesson, fetchLesson, allCoursesList, updateUser, userLoading, usersList}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);
    const [ currentCourse, setCurrentCourse ] = useState(null);
    const [ startQuestions, setStartQuestions ] = useState(false);
    const [ currentUser, setCurrentUser ] = useState(null);

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
                </h2>
                {
                    lesson && lesson.questions.length && !startQuestions ?
                        !hasAnswers() ?
                            <div className="content__title-actions">
                                <a href="/" className="btn btn_primary" onClick={e => handleStartQuestions(e)}>
                                    { translate('start_quiz') }
                                </a>
                            </div>
                            :
                            <div className="content__title-actions">
                                <div className="studentLesson__score">
                                    <div className="studentLesson__score-item">
                                        <div>{ translate('score') }</div>
                                        <div className="studentLesson__score-num">{ hasAnswers().gotScore }<span> / { lesson.maxScore }</span></div>
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
                    lesson.questions.length && startQuestions ?
                        <Article content={lesson['questions']} type={'questions'} finishQuestions={finishQuestions} loading={userLoading}/>
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
        const updatedUser = usersList.find(item => item.id === JSON.parse(currentUser).id);

        answers.maxScore = lesson.maxScore;

        if ( updatedUser.scores ) {
            if ( updatedUser.scores[params.subjectID] ) {
                if ( updatedUser.scores[params.subjectID][params.courseID] ) {
                    if ( updatedUser.scores[params.subjectID][params.courseID][params.moduleID] ) {
                        updatedUser.scores[params.subjectID][params.courseID][params.moduleID][params.lessonID] = answers;
                    }
                    else {
                        updatedUser.scores[params.subjectID][params.courseID][params.moduleID] = {};
                        updatedUser.scores[params.subjectID][params.courseID][params.moduleID][params.lessonID] = answers;
                    }
                }
                else {
                    updatedUser.scores[params.subjectID][params.courseID] = {};
                    updatedUser.scores[params.subjectID][params.courseID][params.moduleID] = {};
                    updatedUser.scores[params.subjectID][params.courseID][params.moduleID][params.lessonID] = answers;
                }
            }
            else {
                updatedUser.scores[params.subjectID] = {};
                updatedUser.scores[params.subjectID][params.courseID] = {};
                updatedUser.scores[params.subjectID][params.courseID][params.moduleID] = {};
                updatedUser.scores[params.subjectID][params.courseID][params.moduleID][params.lessonID] = answers;
            }
        }
        else {
            updatedUser.scores = {};
            updatedUser.scores[params.subjectID] = {};
            updatedUser.scores[params.subjectID][params.courseID] = {};
            updatedUser.scores[params.subjectID][params.courseID][params.moduleID] = {};
            updatedUser.scores[params.subjectID][params.courseID][params.moduleID][params.lessonID] = answers;
        }

        updateUser(JSON.parse(currentUser).id, updatedUser);

        delete updatedUser.password;
        setCurrentUser(JSON.stringify(updatedUser));
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    function hasAnswers() {
        let hasAnswers = null;
        const parsedUser = JSON.parse(currentUser);

        if ( parsedUser && parsedUser.scores && parsedUser.scores[params.subjectID] && parsedUser.scores[params.subjectID][params.courseID] && parsedUser.scores[params.subjectID][params.courseID][params.moduleID] && parsedUser.scores[params.subjectID][params.courseID][params.moduleID][params.lessonID] ) {
            hasAnswers = parsedUser.scores[params.subjectID][params.courseID][params.moduleID][params.lessonID];
        }

        return hasAnswers;
    }
}

const mapStateToProps = state => ({
    lesson: state.coursesReducer.lesson,
    loading: state.coursesReducer.loading,
    userLoading: state.usersReducer.loading,
    usersList: state.usersReducer.usersList
});
const mapDispatchToProps = dispatch => ({
    fetchLesson: (subjectID, courseID, moduleID, lessonID) => dispatch(fetchLesson(subjectID, courseID, moduleID, lessonID)),
    updateUser: (id, data) => dispatch(updateUser(id, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentCourseLesson);
