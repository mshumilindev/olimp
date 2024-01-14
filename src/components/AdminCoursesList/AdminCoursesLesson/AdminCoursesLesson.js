import React, {useContext, useEffect, useState} from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import {withRouter, Link} from "react-router-dom";
import {deleteLesson} from "../../../redux/actions/coursesActions";
import {connect} from "react-redux";

import ContextMenu from '../../UI/ContextMenu/ContextMenu';
import Confirm from '../../UI/Confirm/Confirm';

function AdminCoursesLesson({history, subjectID, courseID, moduleID, lesson, params, deleteLesson, editOrder, isLessonCoppied, setIsLessonCoppied}) {
    const { lang, translate } = useContext(siteSettingsContext);
    const [ showConfirm, setShowConfirm ] = useState(false);
    const contextLinks = [
        {
            name: translate('edit_lesson'),
            icon: 'fa fa-pencil-alt',
            action: handleEditLesson,
            id: 0
        },
        {
            name: 'Копіювати урок',
            icon: 'fas fa-copy',
            action: handleCopyLesson,
            id: 1
        },
        {
            name: translate('delete_lesson'),
            icon: 'fa fa-trash-alt',
            type: 'error',
            action: handleDeleteLesson,
            id: 3
        }
    ];

    return (
        <div className="adminCourses__list-item" style={{padding: '5px 0'}}>
            {
                editOrder ?
                    <span className="adminCourses__list-courses-link isReordered">
                        <i className="content_title-icon fas fa-grip-lines" />
                        { lesson.name[lang] ? lesson.name[lang] : lesson.name['ua'] }
                    </span>
                    :
                    <ContextMenu links={contextLinks}>
                        <Link to={'/admin-lessons/' + params.subjectID + '/' + params.courseID + '/' + params.moduleID + '/' + lesson.id} className="adminCourses__list-courses-link">
                            <i className="content_title-icon fa fa-paragraph" />
                            { lesson.name[lang] ? lesson.name[lang] : lesson.name['ua'] }
                        </Link>
                    </ContextMenu>
            }
            {
                showConfirm ?
                    <Confirm message={translate('sure_to_delete_lesson')} cancelAction={() => setShowConfirm(false)} confirmAction={confirmDeleteLesson} />
                    :
                    null
            }
        </div>
    );

    function handleEditLesson() {
        history.push(history.location.pathname + '/' + lesson.id);
    }

    function handleCopyLesson() {
        setIsLessonCoppied({
          subjectID,
          courseID,
          moduleID,
          lesson
        })
    }

    function handleDeleteLesson() {
        setShowConfirm(true);
    }

    function confirmDeleteLesson() {
        deleteLesson(subjectID, courseID, moduleID, lesson.id);
        setShowConfirm(false);
    }
}
const mapDispatchToProps = dispatch => ({
    deleteLesson: (subjectID, courseID, moduleID, lessonID) => dispatch(deleteLesson(subjectID, courseID, moduleID, lessonID))
});
export default connect(null, mapDispatchToProps)(withRouter(AdminCoursesLesson));
