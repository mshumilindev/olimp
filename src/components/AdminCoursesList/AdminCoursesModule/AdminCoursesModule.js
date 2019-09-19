import React, { useContext, useEffect, useState } from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import {Link} from "react-router-dom";
import {deleteModule, fetchLessons} from "../../../redux/actions/coursesActions";
import {connect} from "react-redux";
import classNames from "classnames";
import AdminCoursesLesson from '../AdminCoursesLesson/AdminCoursesLesson';
import UpdateModule from "../AdminCoursesActions/UpdateModule";
import UpdateLesson from "../AdminCoursesActions/UpdateLesson";

const ContextMenu = React.lazy(() => import('../../UI/ContextMenu/ContextMenu'));
const Confirm = React.lazy(() => import('../../UI/Confirm/Confirm'));

function AdminCoursesModule({subjectID, courseID, module, params, loading, fetchLessons, deleteModule}) {
    const { lang, translate } = useContext(siteSettingsContext);
    const [ showUpdateModule, setShowUpdateModule ] = useState(false);
    const [ showConfirm, setShowConfirm ] = useState(false);
    const [ showUpdateLesson, setShowUpdateLesson ] = useState(false);
    const contextLinks = [
        {
            name: translate('create_lesson'),
            icon: 'fa fa-plus',
            action: handleCreateLesson,
            id: 0
        },
        {
            type: 'divider',
            id: 1
        },
        {
            name: translate('edit_module'),
            icon: 'fa fa-pencil-alt',
            action: handleEditModule,
            id: 2
        },
        {
            name: translate('delete_module'),
            icon: 'fa fa-trash-alt',
            type: 'error',
            action: handleDeleteModule,
            id: 3
        }
    ];

    useEffect(() => {
        if ( checkIfIsOpen() && !module.lessons ) {
            fetchLessons(params.subjectID, params.courseID, module.id);
        }
    });

    return (
        <div className={classNames('adminCourses__list-item', {someOpen: params && params.moduleID && params.moduleID !== module.id, isOpen: params && params.moduleID === module.id})} style={{marginTop: 10}}>
            <ContextMenu links={contextLinks}>
                <Link to={'/admin-courses/' + params.subjectID + '/' + params.courseID + '/' + module.id} className="adminCourses__list-courses-link">
                    {
                        checkIfIsOpen() ?
                            loading ?
                                <i className="content_title-icon fas fa-spinner" />
                                :
                                <i className="content_title-icon fa fa-book-open" />
                            :
                            <i className="content_title-icon fa fa-book" />
                    }
                    { module.name[lang] ? module.name[lang] : module.name['ua'] }
                </Link>
            </ContextMenu>
            {
                params && params.moduleID === module.id ?
                    <div className="adminCourses__list-courses" style={{marginTop: -10}}>
                        {
                            module.lessons && module.lessons.length ?
                                sortLessons().map(item => <AdminCoursesLesson key={item.index} lesson={item} params={params} subjectID={subjectID} courseID={courseID} moduleID={module.id} />)
                                :
                                <div className="adminCourses__list-item adminCourses__list-item-nothingFound" style={{marginTop: 10}}>
                                    <i className="content_title-icon fa fa-unlink" />
                                    { translate('no_lessons') }
                                </div>
                        }
                    </div>
                    :
                    null
            }
            {
                showUpdateModule ?
                    <UpdateModule params={params} subjectID={subjectID} courseID={courseID} module={module} loading={loading} setShowUpdateModule={setShowUpdateModule}/>
                    :
                    null
            }
            {
                showUpdateLesson ?
                    <UpdateLesson params={params} subjectID={subjectID} courseID={courseID} moduleID={module.id} lesson={null} loading={loading} setShowUpdateLesson={setShowUpdateLesson}/>
                    :
                    null
            }
            {
                showConfirm ?
                    <Confirm message={translate('sure_to_delete_module')} cancelAction={() => setShowConfirm(false)} confirmAction={() => deleteModule(subjectID, courseID, module.id)} />
                    :
                    null
            }
        </div>
    );

    function handleCreateLesson() {
        setShowUpdateLesson(true);
    }

    function handleEditModule() {
        setShowUpdateModule(true);
    }

    function handleDeleteModule() {
        setShowConfirm(true);
    }

    function checkIfIsOpen() {
        return params && params.moduleID === module.id;
    }

    function sortLessons() {
        return module.lessons.sort((a, b) => {
            if ( a.index < b.index ) {
                return -1;
            }
            if ( a.index > b.index ) {
                return 1;
            }
            return 0;
        });
    }
}
const mapDispatchToProps = dispatch => ({
    fetchLessons: (subjectID, courseID, moduleID) => dispatch(fetchLessons(subjectID, courseID, moduleID)),
    deleteModule: (subjectID, courseID, moduleID) => dispatch(deleteModule(subjectID, courseID, moduleID))
});
export default connect(null, mapDispatchToProps)(AdminCoursesModule);