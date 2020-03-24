import React, { useContext, useState, useEffect, useRef } from 'react';
import {fetchLesson, updateLesson} from "../../redux/actions/coursesActions";
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import {Preloader} from "../../components/UI/preloader";
import ContentEditor from '../../components/UI/ContentEditor/ContentEditor';
import userContext from "../../context/userContext";
import Breadcrumbs from "../../components/UI/Breadcrumbs/Breadcrumbs";
import './adminLesson.scss';

const Form = React.lazy(() => import('../../components/Form/Form'));

// === Need to move this to a separate file from all the files it's used in
function usePrevious(value) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

function AdminLesson({fetchLesson, updateLesson, params, lesson, loading, allCoursesList}) {
    const { translate, lang, getLessonFields } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);
    const [ lessonUpdated, setLessonUpdated ] = useState(false);
    const [ lessonInfoFields, setLessonInfoFields ] = useState(null);
    const { subjectID, courseID, moduleID, lessonID } = params;
    const prevLesson = usePrevious(lesson);
    const [ content, setContent ] = useState(null);
    const [ questions, setQuestions ] = useState(null);
    const breadcrumbs = [
        {
            name: translate('subjects'),
            url: '/admin-courses'
        }
    ];

    if ( !lesson ) {
        fetchLesson(subjectID, courseID, moduleID, lessonID);
    }
    else if ( lesson.id !== lessonID ) {
        fetchLesson(subjectID, courseID, moduleID, lessonID);
    }
    else {
        if ( !lessonInfoFields ) {
            setLessonInfoFields(JSON.stringify(getLessonFields(lesson, false)));
        }
        if ( !content ) {
            if ( lesson.content ) {
                setContent(lesson.content);
            }
            else {
                setContent([]);
            }
            if ( lesson.questions ) {
                lesson.questions.maxScore = lesson.maxScore;
                setQuestions(lesson.questions);
            }
            else {
                setQuestions([]);
            }
        }
    }

    useEffect(() => {
        if ( prevLesson && JSON.stringify(prevLesson) !== JSON.stringify(lesson) ) {
            setLessonUpdated(false);
            setLessonInfoFields(JSON.stringify(getLessonFields(lesson, false)));
        }
    }, [prevLesson, lesson, getLessonFields]);

    checkIfEditable();

    return (
        lesson && lesson.id === lessonID ?
            <div className="adminLesson section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className="content_title-icon fa fa-paragraph" />
                        <Breadcrumbs list={getBreadcrumbs()} />
                    </h2>
                    {
                        checkIfEditable() ?
                            <div className="section__title-actions">
                                <a href="/" className="btn btn__success" disabled={!lessonUpdated} onClick={saveLesson}>
                                    <i className="content_title-icon fa fa-save" />
                                    { translate('save') }
                                </a>
                            </div>
                            :
                            null
                    }
                    {
                        loading ?
                            <Preloader size={60}/>
                            :
                            null
                    }
                </div>
                <div className="grid">
                    <div className="grid_col col-8">
                        <div className="widget">
                            <div className="widget__title">
                                <i className="content_title-icon fa fa-file-alt"/>
                                { translate('content') }
                            </div>
                            <div className="widget__descr">
                                <h3>Активні елементи:</h3>
                                <p><i className="content_title-icon fas fa-question-circle"/> - інформація, щодо використання блоку</p>
                                <p><i className="content_title-icon fa fa-cog"/> - налаштування блоку</p>
                                <p><i className="content_title-icon fa fa-trash-alt"/> - видалити блок</p>
                            </div>
                            <ContentEditor contentType="content" content={content} types={[['text', 'media', 'word', 'powerpoint'], ['youtube', 'audio'], ['divider', 'page']]} setUpdated={() => setLessonUpdated(true)} setLessonContent={(newContent) => setContent(newContent)} loading={loading} />
                        </div>
                        <div className="widget">
                            <div className="widget__title">
                                <i className="content_title-icon fa fa-question"/>
                                { translate('control_questions') }
                            </div>
                            <ContentEditor contentType="questions" content={questions} types={[['text', 'media'], ['youtube', 'audio'], ['answers'], ['divider', 'page']]} setUpdated={() => setLessonUpdated(true)} setLessonContent={(newQuestions) => setQuestions(newQuestions)} loading={loading} />
                        </div>
                    </div>
                    <div className="grid_col col-4">
                        <div className="widget">
                            <div className="widget__title">
                                <i className="content_title-icon fa fa-info"/>
                                { translate('info') }
                            </div>
                            {
                                checkIfEditable() ?
                                    <Form fields={JSON.parse(lessonInfoFields)} setFieldValue={setInfoFieldValue} loading={loading} />
                                    :
                                    lesson.name[lang] ? lesson.name[lang] : lesson.name['ua']
                            }
                        </div>
                    </div>
                </div>
            </div>
            :
            <Preloader/>
    );

    function getBreadcrumbs() {
        if ( params ) {
            let currentSubject = null;
            let currentCourse = null;
            let currentModule = null;

            if ( params.subjectID ) {
                currentSubject = allCoursesList.find(item => item.id === params.subjectID);
                breadcrumbs.push({
                    name: currentSubject ? currentSubject.name[lang] ? currentSubject.name[lang] : currentSubject.name['ua'] : '',
                    url: '/admin-courses/' + params.subjectID
                });
            }
            if ( params.courseID ) {
                if ( currentSubject.coursesList ) {
                    currentCourse = currentSubject.coursesList.find(item => item.id === params.courseID);
                    breadcrumbs.push({
                        name: currentCourse ? currentCourse.name[lang] ? currentCourse.name[lang] : currentCourse.name['ua'] : '',
                        url: '/admin-courses/' + params.subjectID + '/' + params.courseID
                    });
                }
            }
            if ( params.moduleID ) {
                if ( currentCourse && currentCourse.modules ) {
                    currentModule = currentCourse.modules.find(item => item.id === params.moduleID);
                    breadcrumbs.push({
                        name: currentModule ? currentModule.name[lang] ? currentModule.name[lang] : currentModule.name['ua'] : '',
                        url: '/admin-courses/' + params.subjectID + '/' + params.courseID + '/' + params.moduleID
                    });
                }
            }
        }

        breadcrumbs.push({
            name: `<span class="breadcrumbs__modifier">${translate('lesson')}: </span>${lesson.name[lang] ? lesson.name[lang] : lesson.name['ua']}`,
            url: '/admin-courses/' + params.subjectID + '/' + params.courseID + '/' + params.moduleID + '/' + params.lessonID
        });

        return breadcrumbs;
    }

    function checkIfEditable() {
        let isEditable = false;

        if ( user.role === 'admin' ) {
            isEditable = true;
        }
        else {
            if ( allCoursesList ) {
                allCoursesList.forEach(subjectItem => {
                    if ( subjectItem.coursesList.length ) {
                        subjectItem.coursesList.forEach(courseItem => {
                            if (courseItem.id === courseID ) {
                                if ( courseItem.teacher === user.id ) {
                                    isEditable = true;
                                }
                            }
                        });
                    }
                });
            }
        }

        return isEditable;
    }

    function setInfoFieldValue(fieldID, value) {
        const newLessonInfoFields = JSON.parse(lessonInfoFields);

        newLessonInfoFields.find(field => field.id === fieldID).value = value;
        newLessonInfoFields.find(field => field.id === fieldID).updated = false;
        setLessonUpdated(false);

        if ( fieldID === 'lessonName_ua' ) {
            if ( lesson.name.ua !== value ) {
                newLessonInfoFields.find(field => field.id === fieldID).updated = true;
                setLessonUpdated(true);
            }
        }
        if ( fieldID === 'lessonName_ru' ) {
            if ( lesson.name.ru !== value ) {
                newLessonInfoFields.find(field => field.id === fieldID).updated = true;
                setLessonUpdated(true);
            }
        }
        if ( fieldID === 'lessonName_en' ) {
            if ( lesson.name.en !== value ) {
                newLessonInfoFields.find(field => field.id === fieldID).updated = true;
                setLessonUpdated(true);
            }
        }

        setLessonInfoFields(JSON.stringify(newLessonInfoFields));
    }

    function saveLesson(e) {
        e.preventDefault();

        if ( lessonUpdated ) {
            const updatedLessonFields = JSON.parse(lessonInfoFields);
            const newLesson = {
                ...lesson,
                name: {
                    ua: updatedLessonFields.find(field => field.id === 'lessonName_ua').value,
                    ru: updatedLessonFields.find(field => field.id === 'lessonName_ru').value,
                    en: updatedLessonFields.find(field => field.id === 'lessonName_en').value,
                },
                content: content,
                questions: questions
            };
            delete newLesson.maxScore;
            if ( newLesson.questions.maxScore ) {
                newLesson.maxScore = newLesson.questions.maxScore;
            }
            updateLesson(subjectID, courseID, moduleID, newLesson);
        }
    }
}
const mapStateToProps = state => ({
    lesson: state.coursesReducer.lesson,
    loading: state.coursesReducer.loading,
    allCoursesList: state.coursesReducer.coursesList
});
const mapDispatchToProps = dispatch => ({
    fetchLesson: (subjectID, courseID, moduleID, lessonID) => dispatch(fetchLesson(subjectID, courseID, moduleID, lessonID)),
    updateLesson: (subjectID, courseID, moduleID, lesson) => dispatch(updateLesson(subjectID, courseID, moduleID, lesson))
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminLesson);