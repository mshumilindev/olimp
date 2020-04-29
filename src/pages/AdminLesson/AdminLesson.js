import React, { useContext, useState, useEffect } from 'react';
import {updateLesson, discardLesson} from "../../redux/actions/coursesActions";
import { fetchLessonMeta } from '../../redux/actions/lessonActions';
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import Preloader from "../../components/UI/preloader";
import ContentEditor from '../../components/UI/ContentEditor/ContentEditor';
import Breadcrumbs from "../../components/UI/Breadcrumbs/Breadcrumbs";
import './adminLesson.scss';
import Modal from "../../components/UI/Modal/Modal";
import Article from "../../components/Article/Article";
import { withRouter, Prompt } from 'react-router-dom';
import withAdminLesson from "./withAdminLesson";
import AdminLessonContent from "../../components/AdminLesson/AdminLessonContent";

const Form = React.lazy(() => import('../../components/Form/Form'));

function AdminLesson({user, fetchLessonMeta, updateLesson, params, lessonMeta, loading, allCoursesList, discardLesson}) {
    const { translate, lang, getLessonFields } = useContext(siteSettingsContext);
    const [ lessonUpdated, setLessonUpdated ] = useState(false);
    const [ lessonInfoFields, setLessonInfoFields ] = useState(null);
    const { subjectID, courseID, moduleID, lessonID } = params;
    const [ content, setContent ] = useState(null);
    const [ QA, setQA ] = useState(null);
    const [ showPreview, setShowPreview ] = useState(false);
    const breadcrumbs = [
        {
            name: translate('subjects'),
            url: '/admin-courses'
        }
    ];

    useEffect(() => {
        fetchLessonMeta(subjectID, courseID, moduleID, lessonID);
        return () => {
            discardLesson();
        }
    }, []);

    useEffect(() => {
        window.onbeforeunload = lessonUpdated && (() => translate('save_before_leaving'));
    });

    useEffect(() => {
        if ( lessonMeta ) {
            if ( !lessonInfoFields ) {
                setLessonInfoFields(getLessonFields(lessonMeta, false));
            }
            // if ( !content ) {
            //     if ( lesson.content ) {
            //         setContent(Object.assign([], lesson.content));
            //     }
            //     else {
            //         setContent(Object.assign([], []));
            //     }
            //     if ( lesson.QA ) {
            //         setQA(Object.assign([], lesson.QA));
            //     }
            //     else {
            //         setQA(Object.assign([], []));
            //     }
            // }
            setLessonUpdated(false);
            setLessonInfoFields(Object.assign([], getLessonFields(lessonMeta, false)));
        }
    }, [lessonMeta]);

    return (
        lessonMeta && allCoursesList ?
            <div className="adminLesson section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className="content_title-icon fa fa-paragraph" />
                        <Breadcrumbs list={getBreadcrumbs()} />
                    </h2>
                    {
                        checkIfEditable() ?
                            <div className="section__title-actions">
                                <a href="/" className="btn btn_primary" disabled={lessonUpdated} onClick={previewLesson}>
                                    <i className="content_title-icon fa fa-eye" />
                                    { translate('preview') }
                                </a>
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
                    <div className="grid_col col-8" style={{maxWidth: 880}}>
                        <AdminLessonContent subjectID={subjectID} courseID={courseID} moduleID={moduleID} lessonID={lessonMeta.id} title={lessonMeta.name[lang] ? lessonMeta.name[lang] : lessonMeta.name['ua']} />
                        {/*<div className="widget">*/}
                        {/*    <div className="widget__title">*/}
                        {/*        <i className="content_title-icon fa fa-question"/>*/}
                        {/*        { translate('control_questions') }*/}
                        {/*    </div>*/}
                        {/*    {*/}
                        {/*        QA ?*/}
                        {/*            <ContentEditor contentType="questions" content={QA} types={[['text', 'formula', 'media'], ['youtube', 'audio'], ['answers'], ['divider']]} setUpdated={value => setLessonUpdated(value)} isUpdated={lessonUpdated} setLessonContent={(newQuestions) => setQA(Object.assign([], newQuestions))} loading={loading} />*/}
                        {/*            :*/}
                        {/*            null*/}
                        {/*    }*/}
                        {/*</div>*/}
                    </div>
                    <div className="grid_col col-4" style={{maxWidth: 500}}>
                        <div className="widget sticky">
                            <div className="widget__title">
                                <i className="content_title-icon fa fa-info"/>
                                { translate('info') }
                            </div>
                            {
                                checkIfEditable() ?
                                    <Form fields={lessonInfoFields} setFieldValue={setInfoFieldValue} loading={loading} />
                                    :
                                    lessonMeta.name[lang] ? lessonMeta.name[lang] : lessonMeta.name['ua']
                            }
                        </div>
                    </div>
                </div>
                {
                    showPreview ?
                        <Modal className="adminLesson__previewModal" heading={lessonMeta.name[lang] ? lessonMeta.name[lang] : lessonMeta.name['ua']} onHideModal={() => setShowPreview(false)}>
                            <Article content={lessonMeta['content']} type={'content'} />
                        </Modal>
                        :
                        null
                }
                <Prompt when={lessonUpdated} message={translate('save_before_leaving')} />
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
            name: `<span class="breadcrumbs__modifier">${translate('lesson')}: </span>${lessonMeta.name[lang] ? lessonMeta.name[lang] : lessonMeta.name['ua']}`,
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
        const newLessonInfoFields = lessonInfoFields;

        newLessonInfoFields.find(field => field.id === fieldID).value = value;
        newLessonInfoFields.find(field => field.id === fieldID).updated = false;
        setLessonUpdated(false);

        if ( fieldID === 'lessonName_ua' ) {
            if ( lessonMeta.name.ua !== value ) {
                newLessonInfoFields.find(field => field.id === fieldID).updated = true;
                setLessonUpdated(true);
            }
        }
        if ( fieldID === 'lessonName_ru' ) {
            if ( lessonMeta.name.ru !== value ) {
                newLessonInfoFields.find(field => field.id === fieldID).updated = true;
                setLessonUpdated(true);
            }
        }
        if ( fieldID === 'lessonName_en' ) {
            if ( lessonMeta.name.en !== value ) {
                newLessonInfoFields.find(field => field.id === fieldID).updated = true;
                setLessonUpdated(true);
            }
        }

        setLessonInfoFields(Object.assign([], newLessonInfoFields));
    }

    function saveLesson(e) {
        e.preventDefault();

        if ( lessonUpdated ) {
            const updatedLessonFields = lessonInfoFields;
            const newLesson = {
                ...lessonMeta,
                name: {
                    ua: updatedLessonFields.find(field => field.id === 'lessonName_ua').value,
                    ru: updatedLessonFields.find(field => field.id === 'lessonName_ru').value,
                    en: updatedLessonFields.find(field => field.id === 'lessonName_en').value,
                },
                content: content,
                QA: QA
            };
            updateLesson(subjectID, courseID, moduleID, newLesson);
        }
    }

    function previewLesson(e) {
        e.preventDefault();

        if ( !lessonUpdated ) {
            setShowPreview(true);
        }
    }
}
const mapStateToProps = state => ({
    lessonMeta: state.lessonReducer.lessonMeta,
    loading: state.lessonReducer.loading,
    user: state.authReducer.currentUser,
    allCoursesList: state.coursesReducer.coursesList
});
const mapDispatchToProps = dispatch => ({
    fetchLessonMeta: (subjectID, courseID, moduleID, lessonID) => dispatch(fetchLessonMeta(subjectID, courseID, moduleID, lessonID)),
    updateLesson: (subjectID, courseID, moduleID, lesson) => dispatch(updateLesson(subjectID, courseID, moduleID, lesson)),
    discardLesson: () => dispatch(discardLesson())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withAdminLesson(AdminLesson)));