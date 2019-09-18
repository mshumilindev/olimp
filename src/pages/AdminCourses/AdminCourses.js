import React, { useContext, useState, useEffect, useRef } from 'react';
import {Preloader} from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import withFilters from "../../utils/withFilters";
import { withRouter } from 'react-router-dom';
import {fetchSubjects, updateSubject} from "../../redux/actions/coursesActions";
import {connect} from "react-redux";
import Breadcrumbs from '../../components/UI/Breadcrumbs/Breadcrumbs';
import AdminCoursesSubject from "../../components/AdminCoursesList/AdminCoursesSubject/AdminCoursesSubject";
import '../../components/AdminCoursesList/adminCourses.scss';

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

function AdminCourses({history, filters, list, loading, searchQuery, params, updateSubject}) {
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
    const breadcrumbs = [
        {
            name: translate('subjects'),
            url: '/admin-courses'
        }
    ];
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
                </div>
                { filters }
                <div className="adminLibrary__list widget">
                    {
                        list ?
                            list.length ?
                                <>
                                    <div className="widget__title">
                                        <Breadcrumbs list={getBreadcrumbs()} />
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
                            <Preloader/>
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

    function handleCreateSubject() {
        const newSubjectFields = JSON.parse(subjectFields);
        const newSubject = {};

        newSubject.name = {
            en: newSubjectFields.find(item => item.id === 'subjectName_en').value,
            ru: newSubjectFields.find(item => item.id === 'subjectName_ru').value,
            ua: newSubjectFields.find(item => item.id === 'subjectName_ua').value
        };
        newSubject.id = identify(transliterize(newSubject.name['ua']));

        if ( list.some(item => item.id === newSubject.id) ) {
            setFormError(translate('subject_already_exists'));
        }
        else {
            setFormError(null);
            updateSubject(newSubject);
        }
    }

    function setFieldValue(fieldID, value) {
        const newSubjectFields = JSON.parse(subjectFields);

        newSubjectFields.find(item => item.id === fieldID).value = value;
        newSubjectFields.find(item => item.id === fieldID).updated = true;
        setFormUpdated(true);

        setSubjectFields(JSON.stringify(newSubjectFields));
    }

    function toggleModal() {
        setShowModal(false);
        setSubjectFields(JSON.stringify(getSubjectFields(getSubjectModel())));
    }

    function filterList() {
        return list.filter(item => searchQuery.trim().length ? item.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) : true).sort((a, b) => {
            const aName = a.name[lang] ? a.name[lang] : a.name['ua'];
            const bName = b.name[lang] ? b.name[lang] : b.name['ua'];

            if ( aName < bName ) {
                return -1;
            }
            else if ( aName > bName ) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }

    function showCreateSubjectModal(e) {
        e.preventDefault();

        setShowModal(true);
    }

    function getBreadcrumbs() {
        if ( params ) {
            let currentSubject = null;
            let currentCourse = null;
            let currentModule = null;

            if ( params.subjectID ) {
                currentSubject = list.find(item => item.id === params.subjectID);
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

        return breadcrumbs;
    }
}

const mapStateToProps = state => ({
    list: state.coursesReducer.subjectsList,
    loading: state.coursesReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchSubjects: dispatch(fetchSubjects()),
    updateSubject: (subject) => dispatch(updateSubject(subject))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withFilters(AdminCourses, true)));