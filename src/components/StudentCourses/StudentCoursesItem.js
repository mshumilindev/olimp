import React, { useEffect, useState, useContext } from 'react';
import firebase from "../../db/firestore";
import Preloader from "../UI/preloader";
import '../../pages/StudentCourse/studentCourse.scss';
import siteSettingsContext from "../../context/siteSettingsContext";
import classNames from "classnames";
import {Link} from "react-router-dom";
import { connect } from 'react-redux';

const db = firebase.firestore();

function StudentCoursesItem({user, subjectID, courseID, currentUser, tests}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ modulesLessons, setModulesLessons ] = useState(null);

    useEffect(() => {
        fetchModulesLessons(subjectID, courseID);
    }, [subjectID, courseID]);

    return (
        tests ?
            <div className="studentCourse">
                { _renderModules() }
            </div>
            :
            null
    );

    function _renderModules() {
        return (
            <div className="studentCourse__modules" style={{padding: '0 0 20px 20px'}}>
                {
                    !modulesLessons ?
                        <Preloader/>
                        :
                        modulesLessons.length ?
                            modulesLessons.sort((a, b) => a.index - b.index).map(module => _renderModule(module))
                            :
                            <div className="studentCourse__modules-notFound">
                                { translate('no_lessons') }
                            </div>
                }
            </div>
        )
    }

    function _renderModule(module) {
        return (
            <div className="studentCourse__modules-item" key={module.id}>
                <div className="studentCourse__module-name">
                    {
                        module.name[lang] ?
                            module.name[lang]
                            :
                            module.name['ua']
                    }
                </div>
                <div className="studentCourse__module-lessons">
                    {
                        module.lessons.length ?
                            module.lessons.sort((a, b) => {
                                if ( a.index < b.index ) {
                                    return -1;
                                }
                                if ( a.index > b.index ) {
                                    return 1;
                                }
                                return 0;
                            }).map(lesson  => _renderLesson(module.id, lesson))
                            :
                            <div className="studentCourse__module-lessons-notFound">
                                { translate('no_lessons') }
                            </div>
                    }
                </div>
            </div>
        )
    }

    function _renderLesson(moduleID, lesson) {
        return (
            <div className="studentCourse__module-lessons-item" key={lesson.id}>
                <div className={classNames('studentCourse__module-lessons-icon', { hasScore: checkIfHasScore(moduleID, lesson.id) })}>
                    {
                        checkIfHasScore(moduleID, lesson.id) ?
                            <i className="fa fa-check" />
                            :
                            <i className="fa fa-paragraph" />
                    }
                </div>
                {
                    currentUser ?
                        <span className="studentCourse__module-lesson-name">
                            {
                                lesson.name[lang] ?
                                    lesson.name[lang]
                                    :
                                    lesson.name['ua']
                            }
                        </span>
                        :
                        <Link to={'/courses/' + subjectID + '/' + courseID + '/' + moduleID + '/' + lesson.id}>
                            <span className="studentCourse__module-lesson-name">
                                {
                                    lesson.name[lang] ?
                                        lesson.name[lang]
                                        :
                                        lesson.name['ua']
                                }
                            </span>
                        </Link>
                }
                {
                    checkIfHasScore(moduleID, lesson.id) ?
                        <div className="studentCourse__score">
                            { translate('score') }: <span>{ checkIfHasScore(moduleID, lesson.id) }</span>
                        </div>
                        :
                        null
                }
            </div>
        )
    }

    function fetchModulesLessons() {
        const modulesRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules');
        const modulesLessons = [];
        let modulesI = 0;

        const getLessons = snapshot => {
            const module = snapshot.docs[modulesI];
            const lessonsRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(module.id).collection('lessons');

            modulesLessons.push({
                ...module.data(),
                id: module.id,
                lessons: []
            });

            lessonsRef.get().then(lessons => {
                if ( !lessons.empty ) {
                    if ( lessons.docs.length ) {
                        lessons.docs.forEach(lesson => {
                            modulesLessons.find(item => item.id === module.id).lessons.push({
                                ...lesson.data(),
                                id: lesson.id
                            });
                        });
                        modulesI++;

                        if ( modulesI < snapshot.docs.length ) {
                            getLessons(snapshot);
                        }
                        else {
                            setModulesLessons(modulesLessons);
                        }
                    }
                }
                else {
                    modulesI++;
                    if ( modulesI < snapshot.docs.length ) {
                        getLessons(snapshot);
                    }
                    else {
                        setModulesLessons(modulesLessons);
                    }
                }
            });
        };

        modulesRef.get().then(snapshot => {
            if ( snapshot.docs.length ) {
                getLessons(snapshot);
            }
            else {
                setModulesLessons(modulesLessons);
            }
        });
    }

    function checkIfHasScore(moduleID, lessonID) {
        let hasScore = null;
        const foundTest = tests.find(item => item.lesson.subjectID === subjectID && item.lesson.courseID === courseID && item.lesson.moduleID === moduleID && item.lesson.lessonID === lessonID && item.userID === user.id);

        if ( foundTest && foundTest.score ) {
            hasScore = foundTest.score;
        }

        return hasScore;
    }
}

const mapStateToProps = state => {
    return {
        tests: state.testsReducer.tests,
        user: state.authReducer.currentUser
    }
};

export default connect(mapStateToProps)(StudentCoursesItem);
