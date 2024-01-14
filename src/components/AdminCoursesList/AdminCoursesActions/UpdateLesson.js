import React, { useState, useContext, useEffect, useRef } from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import {updateLesson} from "../../../redux/actions/coursesActions";

import Modal from '../../UI/Modal/Modal';
import Form from '../../Form/Form';

function usePrevious(value) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

function UpdateLesson({history, params, subjectID, courseID, moduleID, lesson, loading, setShowUpdateLesson, updateLesson}) {
    const { translate, getLessonFields, getLessonModel, identify, transliterize } = useContext(siteSettingsContext);
    const currentLesson = lesson ? lesson : getLessonModel();
    const [ formUpdated, setFormUpdated ] = useState(false);
    const [ lessonFields, setLessonFields ] = useState(JSON.stringify(getLessonFields(currentLesson)));
    const prevLoading = usePrevious(loading);

    useEffect(() => {
        if ( prevLoading === true && loading === false ) {
            if ( !params || !params.courseID || params.courseID !== courseID ) {
                history.push(history.location.pathname + '/' + subjectID + '/' + courseID);
            }
            else {
                setShowUpdateLesson(false);
            }
        }
    });

    return (
        <Modal onHideModal={() => toggleModal()}>
            <Form loading={loading} heading={lesson ? translate('edit_lesson') : translate('create_lesson')} fields={JSON.parse(lessonFields)} setFieldValue={setFieldValue} formAction={handleEditLesson} formUpdated={formUpdated}/>
        </Modal>
    );

    function handleEditLesson() {
        const newLessonFields = JSON.parse(lessonFields);
        const newLesson = {};

        newLesson.name = {
            en: newLessonFields.find(item => item.id === 'lessonName_en').value,
            ru: newLessonFields.find(item => item.id === 'lessonName_ru').value,
            ua: newLessonFields.find(item => item.id === 'lessonName_ua').value
        };
        newLesson.id = lesson ? lesson.id : identify(transliterize(newLesson.name['ua']));
        newLesson.index = lesson ? lesson.index : moment().unix();

        updateLesson(subjectID, courseID, moduleID, newLesson);
    }

    function toggleModal() {
        setShowUpdateLesson(false);
    }

    function setFieldValue(fieldID, value) {
        const newLessonFields = JSON.parse(lessonFields);

        newLessonFields.find(item => item.id === fieldID).value = value;
        newLessonFields.find(item => item.id === fieldID).updated = true;

        setFormUpdated(true);

        setLessonFields(JSON.stringify(newLessonFields));
    }
}
const mapDispatchToProps = dispatch => ({
    updateLesson: (subjectID, courseID, moduleID, lesson) => dispatch(updateLesson(subjectID, courseID, moduleID, lesson, true))
});
export default connect(null, mapDispatchToProps)(withRouter(UpdateLesson));
