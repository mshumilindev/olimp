import React, {useContext, useState, useEffect, useMemo, useCallback} from 'react';
import {
    fetchLessonContent,
    fetchLessonMeta,
    fetchLessonQA,
    updateLessonMeta,
    updateLessonContent,
    updateLessonQA
} from '../../redux/actions/lessonActions';
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import Preloader from "../../components/UI/preloader";
import Breadcrumbs from "../../components/UI/Breadcrumbs/Breadcrumbs";
import './adminLesson.scss';
import Modal from "../../components/UI/Modal/Modal";
import Article from "../../components/Article/Article";
import { withRouter, Prompt } from 'react-router-dom';
import withAdminLesson from "./withAdminLesson";
import AdminLessonContent from "../../components/AdminLesson/AdminLessonContent";
import AdminLessonQA from "../../components/AdminLesson/AdminLessonQA";
import {orderBy} from "natural-orderby";
import Form from '../../components/Form/Form';

function AdminLesson(
    {
        user,
        fetchLessonMeta,
        fetchLessonContent,
        fetchLessonQA,
        params,
        lessonMeta,
        lessonContent,
        lessonQA,
        loading,
        allCoursesList,
        updateLessonMeta,
        updateLessonContent,
        updateLessonQA
    }
) {
    const { translate, lang, getLessonFields } = useContext(siteSettingsContext);
    const [ lessonUpdated, setLessonUpdated ] = useState(false);
    const [ contentUpdated, setContentUpdated ] = useState(false);
    const [ QAUpdated, setQAUpdated ] = useState(false);
    const [ lessonInfoFields, setLessonInfoFields ] = useState(null);
    const { subjectID, courseID, moduleID, lessonID } = params;
    const [ currentContent, setCurrentContent ] = useState(null);
    const [ currentQA, setCurrentQA ] = useState(null);
    const [ showPreview, setShowPreview ] = useState(false);
    const breadcrumbs = useMemo(() => (
        [
            {
                name: translate('subjects'),
                url: '/admin-courses'
            }
        ]
    ), [translate]);

    useEffect(() => {
        fetchLessonMeta(subjectID, courseID, moduleID, lessonID);
        fetchLessonContent(subjectID, courseID, moduleID, lessonID);
        fetchLessonQA(subjectID, courseID, moduleID, lessonID);
    }, [fetchLessonMeta, fetchLessonContent, fetchLessonQA, subjectID, courseID, moduleID, lessonID]);

    useEffect(() => {
        setCurrentContent(JSON.parse(JSON.stringify(orderBy(lessonContent, v => v.index))));
    }, [lessonContent]);

    useEffect(() => {
        if ( currentContent ) {
            if ( JSON.stringify(currentContent) !== JSON.stringify(orderBy(lessonContent, v => v.index)) ) {
                setContentUpdated(true);
            }
            else {
                setContentUpdated(false);
            }
        }
    }, [currentContent, setContentUpdated, lessonContent]);

    useEffect(() => {
        setCurrentQA(JSON.parse(JSON.stringify(orderBy(lessonQA, v => v.index))));
    }, [lessonQA]);

    useEffect(() => {
        if ( currentQA ) {
            if ( JSON.stringify(currentQA) !== JSON.stringify(orderBy(lessonQA, v => v.index)) ) {
                setQAUpdated(true);
            }
            else {
                setQAUpdated(false);
            }
        }
    }, [currentQA, lessonQA, setQAUpdated]);

    useEffect(() => {
        window.onbeforeunload = (lessonUpdated || contentUpdated || QAUpdated) && (() => translate('save_before_leaving'));
    });

    useEffect(() => {
        setLessonInfoFields(Object.assign([], getLessonFields(lessonMeta, false)));
        setLessonUpdated(false);
    }, [lessonMeta, setLessonInfoFields, setLessonUpdated, getLessonFields]);

    const getBreadcrumbs = useCallback(() => {
        if ( params ) {
            let currentSubject = null;
            let currentCourse = null;
            let currentModule = null;

            if ( params.subjectID ) {
                currentSubject = allCoursesList.find(item => item.id === params.subjectID);
                if ( !breadcrumbs.some(item => item.url === '/admin-courses/' + params.subjectID) ) {
                    breadcrumbs.push({
                        name: currentSubject ? currentSubject.name[lang] ? currentSubject.name[lang] : currentSubject.name['ua'] : '',
                        url: '/admin-courses/' + params.subjectID
                    });
                }
            }
            if ( params.courseID ) {
                if ( currentSubject && currentSubject.coursesList ) {
                    currentCourse = currentSubject.coursesList.find(item => item.id === params.courseID);
                    if ( !breadcrumbs.some(item => item.url === '/admin-courses/' + params.subjectID + '/' + params.courseID) ) {
                        breadcrumbs.push({
                            name: currentCourse ? currentCourse.name[lang] ? currentCourse.name[lang] : currentCourse.name['ua'] : '',
                            url: '/admin-courses/' + params.subjectID + '/' + params.courseID
                        });
                    }
                }
            }
            if ( params.moduleID ) {
                if ( currentCourse && currentCourse.modules ) {
                    currentModule = currentCourse.modules.find(item => item.id === params.moduleID);
                    if ( !breadcrumbs.some(item => item.url === '/admin-courses/' + params.subjectID + '/' + params.courseID + '/' + params.moduleID) ) {
                        breadcrumbs.push({
                            name: currentModule ? currentModule.name[lang] ? currentModule.name[lang] : currentModule.name['ua'] : '',
                            url: '/admin-courses/' + params.subjectID + '/' + params.courseID + '/' + params.moduleID
                        });
                    }
                }
            }
        }

        if ( !breadcrumbs.some(item => item.url === '/admin-courses/' + params.subjectID + '/' + params.courseID + '/' + params.moduleID + '/' + params.lessonID) ) {
            breadcrumbs.push({
                name: `<span class="breadcrumbs__modifier">${translate('lesson')}: </span>${lessonMeta.name[lang] ? lessonMeta.name[lang] : lessonMeta.name['ua']}`,
                url: '/admin-courses/' + params.subjectID + '/' + params.courseID + '/' + params.moduleID + '/' + params.lessonID
            });
        }

        return breadcrumbs;
    }, [params, breadcrumbs, allCoursesList, lang, lessonMeta, translate]);

    const checkIfEditable = useMemo(() => {
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
    }, [user, allCoursesList, courseID]);

    const setInfoFieldValue = useCallback((fieldID, value) => {
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
    }, [lessonInfoFields, setLessonUpdated, lessonMeta, setLessonInfoFields]);

    const updateContent = useCallback((type, newContent) => {
        if ( type === 'content' ) {
            setCurrentContent(Object.assign([], newContent));
        }
        if ( type === 'QA' ) {
            setCurrentQA(Object.assign([], newContent));
        }
    }, [setCurrentContent, setCurrentQA]);

    const saveLesson = useCallback((e) => {
        e.preventDefault();

        if ( lessonUpdated ) {
            const updatedLessonFields = lessonInfoFields;
            const newMeta = {
                ...lessonMeta,
                name: {
                    ua: updatedLessonFields.find(field => field.id === 'lessonName_ua').value,
                    ru: updatedLessonFields.find(field => field.id === 'lessonName_ru').value,
                    en: updatedLessonFields.find(field => field.id === 'lessonName_en').value,
                }
            };
            updateLessonMeta(subjectID, courseID, moduleID, lessonID, newMeta);
        }

        if ( contentUpdated ) {
            updateLessonContent(subjectID, courseID, moduleID, lessonID, currentContent);
        }

        if ( QAUpdated ) {
            updateLessonQA(subjectID, courseID, moduleID, lessonID, currentQA);
        }
    }, [
        lessonUpdated,
        lessonInfoFields,
        lessonMeta,
        updateLessonMeta,
        contentUpdated,
        updateLessonContent,
        QAUpdated,
        updateLessonQA,
        subjectID,
        courseID,
        moduleID,
        lessonID,
        currentQA,
        currentContent
    ]);

    return (
        lessonMeta && allCoursesList ?
            <div className="adminLesson section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className="content_title-icon fa fa-paragraph" />
                        <Breadcrumbs list={getBreadcrumbs()} />
                    </h2>
                    {
                        checkIfEditable ?
                            <div className="section__title-actions">
                                <a href="/" className="btn btn__success" disabled={!lessonUpdated && !contentUpdated && !QAUpdated} onClick={saveLesson}>
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
                        <AdminLessonContent updateContent={updateContent} title={lessonMeta.name[lang] ? lessonMeta.name[lang] : lessonMeta.name['ua']} setUpdated={setContentUpdated} content={currentContent} />
                        <AdminLessonQA updateContent={updateContent} title={lessonMeta.name[lang] ? lessonMeta.name[lang] : lessonMeta.name['ua']} setUpdated={setQAUpdated} content={currentQA} />
                    </div>
                    <div className="grid_col col-4" style={{maxWidth: 500}}>
                        <div className="widget sticky">
                            <div className="widget__title">
                                <i className="content_title-icon fa fa-info"/>
                                { translate('info') }
                            </div>
                            {
                                checkIfEditable ?
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
                <Prompt when={lessonUpdated || contentUpdated || QAUpdated} message={translate('save_before_leaving')} />
            </div>
            :
            <Preloader/>
    );
}
const mapStateToProps = state => ({
    loading: state.lessonReducer.loading,
    lessonMeta: state.lessonReducer.lessonMeta,
    lessonContent: state.lessonReducer.lessonContent,
    lessonQA: state.lessonReducer.lessonQA,
    user: state.authReducer.currentUser,
    allCoursesList: state.coursesReducer.coursesList
});
const mapDispatchToProps = dispatch => ({
    fetchLessonMeta: (subjectID, courseID, moduleID, lessonID) => dispatch(fetchLessonMeta(subjectID, courseID, moduleID, lessonID)),
    fetchLessonContent: (subjectID, courseID, moduleID, lessonID) => dispatch(fetchLessonContent(subjectID, courseID, moduleID, lessonID)),
    fetchLessonQA: (subjectID, courseID, moduleID, lessonID) => dispatch(fetchLessonQA(subjectID, courseID, moduleID, lessonID)),
    updateLessonMeta: (subjectID, courseID, moduleID, lessonID, newMeta) => dispatch(updateLessonMeta(subjectID, courseID, moduleID, lessonID, newMeta)),
    updateLessonContent: (subjectID, courseID, moduleID, lessonID, newContent) => dispatch(updateLessonContent(subjectID, courseID, moduleID, lessonID, newContent)),
    updateLessonQA: (subjectID, courseID, moduleID, lessonID, newQA) => dispatch(updateLessonQA(subjectID, courseID, moduleID, lessonID, newQA))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withAdminLesson(AdminLesson)));