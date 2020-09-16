import React, {useContext, useState, useEffect, useRef, useCallback} from 'react';
import Preloader from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import withFilters from "../../utils/withFilters";
import { withRouter } from 'react-router-dom';
import {fetchSubjects, updateSubject} from "../../redux/actions/coursesActions";
import {connect} from "react-redux";
import AdminCoursesSubject from "../../components/AdminCoursesList/AdminCoursesSubject/AdminCoursesSubject";
import '../../components/AdminCoursesList/adminCourses.scss';
import { orderBy } from 'natural-orderby';

const Modal = React.lazy(() => import('../../components/UI/Modal/Modal'));
const Form = React.lazy(() => import('../../components/Form/Form'));

// === Need to move this to a separate file from all the files it's used in
function usePrevious(value) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

function AdminCourses({history, filters, list, loading, searchQuery, params, updateSubject, allCoursesList}) {
    if ( params ) {
        if ( params.subjectID && list && list.length && !list.find(item => item.id === params.subjectID) ) {
            history.push('/admin-courses');
        }
        if ( params.courseID && list && list.length && list.find(item => item.id === params.subjectID) && list.find(item => item.id === params.subjectID).coursesList && !list.find(item => item.id === params.subjectID).coursesList.find(item => item.id === params.courseID) ) {
            history.push('/admin-courses/' + params.subjectID);
        }
        if ( params.moduleID && list && list.length && list.find(item => item.id === params.subjectID) && list.find(item => item.id === params.subjectID).coursesList && list.find(item => item.id === params.subjectID).coursesList.find(item => item.id === params.courseID) && list.find(item => item.id === params.subjectID).coursesList.find(item => item.id === params.courseID).modules && !list.find(item => item.id === params.subjectID).coursesList.find(item => item.id === params.courseID).modules.find(item => item.id === params.moduleID) ) {
            history.push('/admin-courses/' + params.subjectID + '/' + params.courseID);
        }
    }
    const { translate, lang, getSubjectModel, getSubjectFields, identify, transliterize } = useContext(siteSettingsContext);
    const [ showModal, setShowModal ] = useState(false);
    const [ subjectFields, setSubjectFields ] = useState(JSON.stringify(getSubjectFields(getSubjectModel())));
    const [ formError, setFormError ] = useState(null);
    const [ formUpdated, setFormUpdated ] = useState(false);
    let prevLoading = usePrevious(loading);

    useEffect(() => {
        if ( showModal && prevLoading && !loading ) {
            toggleModal();
        }
    });

    const handleCreateSubject = useCallback(() => {
        const newSubjectFields = JSON.parse(subjectFields);
        const newSubject = {};

        newSubject.name = {
            en: newSubjectFields.find(item => item.id === 'subjectName_en').value.replace(/\s*$/,''),
            ru: newSubjectFields.find(item => item.id === 'subjectName_ru').value.replace(/\s*$/,''),
            ua: newSubjectFields.find(item => item.id === 'subjectName_ua').value.replace(/\s*$/,'')
        };
        newSubject.id = identify(transliterize(newSubject.name['ua']));

        if ( list.some(item => item.id.toLowerCase() === newSubject.id.toLowerCase()) ) {
            setFormError(translate('subject_already_exists'));
        }
        else {
            setFormError(null);
            updateSubject(newSubject);
        }
    }, [subjectFields, list, setFormError, updateSubject, identify, translate, transliterize]);

    const setFieldValue = useCallback((fieldID, value) => {
        const newSubjectFields = JSON.parse(subjectFields);

        newSubjectFields.find(item => item.id === fieldID).value = value;
        newSubjectFields.find(item => item.id === fieldID).updated = true;
        setFormUpdated(true);

        setSubjectFields(JSON.stringify(newSubjectFields));
    }, [subjectFields, setSubjectFields]);

    const toggleModal = useCallback(() => {
        setShowModal(false);
        setSubjectFields(JSON.stringify(getSubjectFields(getSubjectModel())));
    }, [setShowModal, setSubjectFields, getSubjectFields, getSubjectModel]);

    const filterList = useCallback(() => orderBy(list.filter(item => {
        // let sameTeacher = user.role === 'admin';
        //
        // if ( user.role === 'teacher' ) {
        //     allCoursesList.forEach(subjectItem => {
        //         if ( item.id === subjectItem.id && subjectItem.coursesList.length ) {
        //             subjectItem.coursesList.forEach(courseItem => {
        //                 if ( courseItem.teacher === user.id ) {
        //                     sameTeacher = true;
        //                 }
        //             });
        //         }
        //     });
        // }

        return (searchQuery.trim().length ? item.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) : true)
    }), [v => v.name[lang] ? v.name[lang] : v.name['ua']]), [searchQuery, list, lang]);

    const showCreateSubjectModal = useCallback((e) => {
        e.preventDefault();

        setShowModal(true);
    }, [setShowModal]);

    return (
        <div className="adminCourses">
            <div className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className="content_title-icon fa fa-book" />
                        { translate('courses') }
                    </h2>
                    <div className="section__title-actions">
                        <a href="/" className="btn btn_primary" onClick={showCreateSubjectModal}>
                            <i className="content_title-icon fa fa-plus" />
                            { translate('create_subject') }
                        </a>
                    </div>
                    {
                        loading ?
                            <Preloader size={60}/>
                            :
                            null
                    }
                </div>
                { filters }
                <div className="adminLibrary__list widget">
                    {
                        allCoursesList && list ?
                            list.length ?
                                <>
                                    <div className="widget__descr">
                                        <h3>Правила користування:</h3>
                                        <p>Ліва кнопка миші - обрати предмет/модуль/урок</p>
                                        <p>Права кнопка миші - відкрити контекстне меню</p>
                                        <p><strong>Перед створенням нового основного предмету запевніться, що його ще не існує</strong></p>
                                    </div>
                                    <div className="adminCourses__list">
                                        {
                                            filterList().map(subject => <AdminCoursesSubject params={params} loading={loading} subject={subject} key={subject.id} />)
                                        }
                                    </div>
                                </>
                                :
                                <div className="nothingFound">
                                    <a href="/" className="btn btn_primary" onClick={showCreateSubjectModal}>
                                        <i className="content_title-icon fa fa-plus" />
                                        { translate('create_subject') }
                                    </a>
                                </div>
                            :
                            loading ?
                                <Preloader/>
                                :
                                <div className="nothingFound">
                                    <a href="/" className="btn btn_primary" onClick={showCreateSubjectModal}>
                                        <i className="content_title-icon fa fa-plus" />
                                        { translate('create_subject') }
                                    </a>
                                </div>
                    }
                </div>
            </div>
            {
                showModal ?
                    <Modal onHideModal={() => toggleModal()}>
                        <Form loading={loading} heading={translate('create_subject')} fields={JSON.parse(subjectFields)} setFieldValue={setFieldValue} formAction={handleCreateSubject} formError={formError} formUpdated={formUpdated}/>
                    </Modal>
                    :
                    null
            }
        </div>
    );
}

const mapStateToProps = state => ({
    list: state.coursesReducer.subjectsList,
    loading: state.coursesReducer.loading,
    allCoursesList: state.coursesReducer.coursesList
});
const mapDispatchToProps = dispatch => ({
    fetchSubjects: dispatch(fetchSubjects()),
    updateSubject: (subject) => dispatch(updateSubject(subject))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withFilters(AdminCourses, true)));