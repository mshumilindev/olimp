import React, { useContext, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import siteSettingsContext from '../../../context/siteSettingsContext';
import AdminCoursesCourse from '../AdminCoursesCourse/AdminCoursesCourse';
import {fetchCoursesList, deleteSubject} from "../../../redux/actions/coursesActions";
import {connect} from "react-redux";
import classNames from 'classnames';
import UpdateSubject from '../AdminCoursesActions/UpdateSubject';
import UpdateCourse from '../AdminCoursesActions/UpdateCourse';
import userContext from "../../../context/userContext";
import { orderBy } from 'natural-orderby';

const Confirm = React.lazy(() => import('../../UI/Confirm/Confirm'));
const ContextMenu = React.lazy(() => import('../../UI/ContextMenu/ContextMenu'));

function AdminCoursesSubject({loading, subject, params, fetchCoursesList, deleteSubject}) {
    const { lang, translate } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);
    const [ showUpdateSubject, setShowUpdateSubject ] = useState(false);
    const [ showUpdateCourse, setShowUpdateCourse ] = useState(false);
    const [ showConfirm, setShowConfirm ] = useState(false);
    const contextLinks = [
        {
            name: translate('create_course'),
            icon: 'fa fa-plus',
            action: handleShowCourseUpdate,
            id: 0
        },
        {
            type: 'divider',
            id: 1
        },
        {
            name: translate('edit_subject'),
            icon: 'fa fa-pencil-alt',
            action: () => setShowUpdateSubject(true),
            id: 2
        },
        {
            name: translate('delete_subject'),
            icon: 'fa fa-trash-alt',
            type: 'error',
            action: onDeleteSubject,
            id: 3
        }
    ];

    useEffect(() => {
        if ( checkIfIsOpen() && !subject.coursesList ) {
            fetchCoursesList(subject.id);
        }
    }, []);

    return (
        <div id={subject.id} className={classNames('adminCourses__list-item', {someOpen: params && params.subjectID !== subject.id, isOpen: params && !params.courseID && params.subjectID === subject.id})}>
            <ContextMenu links={contextLinks}>
                <Link to={'/admin-courses' + (params && params.subjectID === subject.id && !params.courseID ? '' : '/' + subject.id)} className="adminCourses__list-link">
                    {
                        checkIfIsOpen() ?
                            loading ?
                                <i className="content_title-icon fas fa-spinner" />
                                :
                                <i className="content_title-icon fa fa-folder-open" />
                            :
                            <i className="content_title-icon fa fa-folder" />
                    }
                    { subject.name[lang] ? subject.name[lang] : subject.name['ua'] }
                </Link>
            </ContextMenu>
            {
                params && params.subjectID === subject.id ?
                    <div className="adminCourses__list-courses" style={{marginTop: -10}}>
                        {
                            subject.coursesList && subject.coursesList.length ?
                                sortCoursesList().map(item => <AdminCoursesCourse subjectID={subject.id} course={item} key={item.index} params={params} loading={loading} />)
                                :
                                <div className="adminCourses__list-item adminCourses__list-item-nothingFound" style={{marginTop: 10}}>
                                    <i className="content_title-icon fa fa-unlink" />
                                    { translate('no_courses') }
                                </div>
                        }
                    </div>
                    :
                    null
            }
            {
                showUpdateSubject ?
                    <UpdateSubject subject={subject} setShowUpdateSubject={setShowUpdateSubject} loading={loading} />
                    :
                    null
            }
            {
                showUpdateCourse ?
                    <UpdateCourse params={params} subjectID={subject.id} course={null} loading={loading} setShowUpdateCourse={setShowUpdateCourse}/>
                    :
                    null
            }
            {
                showConfirm ?
                    <Confirm message={translate('sure_to_delete_subject')} cancelAction={() => setShowConfirm(false)} confirmAction={() => deleteSubject(subject.id)} />
                    :
                    null
            }
        </div>
    );

    function checkIfIsOpen() {
        return params && params.subjectID === subject.id;
    }

    function onDeleteSubject() {
        // === Need to write function in database to implement recursive item deletion (for now subject isn't deleted completely)
        // === Solution can be found here https://firebase.google.com/docs/firestore/solutions/delete-collections
        setShowConfirm(true);
    }

    function handleShowCourseUpdate() {
        setShowUpdateCourse(true);
    }

    function sortCoursesList() {
        return orderBy(subject.coursesList.filter(item => user.role === 'teacher' ? item.teacher === user.id : true), [v => v.name[lang] ? v.name[lang] : v.name['ua']]);
    }
}

const mapDispatchToProps = dispatch => ({
    fetchCoursesList: (subjectID) => dispatch(fetchCoursesList(subjectID)),
    deleteSubject: (subjectID) => dispatch(deleteSubject(subjectID))
});
export default connect(null, mapDispatchToProps)(AdminCoursesSubject);