import React, { useState, useContext, useEffect, useRef } from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import {updateCourse} from "../../../redux/actions/coursesActions";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import moment from 'moment';

const Modal = React.lazy(() => import('../../UI/Modal/Modal'));
const Form = React.lazy(() => import('../../Form/Form'));

function usePrevious(value) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

function UpdateCourse({history, params, subjectID, course, loading, setShowUpdateCourse, updateCourse}) {
    const { translate, getCourseFields, getCourseModel, identify, transliterize } = useContext(siteSettingsContext);
    const currentCourse = course ? course : getCourseModel();
    const [ formUpdated, setFormUpdated ] = useState(false);
    const [ courseFields, setCourseFields ] = useState(JSON.stringify(getCourseFields(currentCourse)));
    const prevLoading = usePrevious(loading);

    useEffect(() => {
        if ( prevLoading === true && loading === false ) {
            if ( !params || !params.subjectID || params.subjectID !== subjectID ) {
                history.push(history.location.pathname + '/' + subjectID);
            }
            else {
                setShowUpdateCourse(false);
            }
        }
    });

    return (
        <Modal onHideModal={() => toggleModal()}>
            <Form loading={loading} heading={course ? translate('edit_course') : translate('create_course')} fields={JSON.parse(courseFields)} setFieldValue={setFieldValue} formAction={handleEditCourse} formUpdated={formUpdated}/>
        </Modal>
    );

    function handleEditCourse() {
        const newCourseFields = JSON.parse(courseFields);
        const newCourse = {};

        newCourse.name = {
            en: newCourseFields.find(item => item.id === 'courseName_en').value,
            ru: newCourseFields.find(item => item.id === 'courseName_ru').value,
            ua: newCourseFields.find(item => item.id === 'courseName_ua').value
        };
        newCourse.id = course ? course.id : identify(transliterize(newCourse.name['ua']));
        newCourse.index = course ? course.index : moment().unix();

        updateCourse(subjectID, newCourse);
    }

    function toggleModal() {
        setShowUpdateCourse(false);
    }

    function setFieldValue(fieldID, value) {
        const newCourseFields = JSON.parse(courseFields);

        newCourseFields.find(item => item.id === fieldID).value = value;
        newCourseFields.find(item => item.id === fieldID).updated = true;

        setFormUpdated(true);

        setCourseFields(JSON.stringify(newCourseFields));
    }
}
const mapDispatchToProps = dispatch => ({
    updateCourse: (subjectID, course) => dispatch(updateCourse(subjectID, course))
});
export default connect(null, mapDispatchToProps)(withRouter(UpdateCourse));