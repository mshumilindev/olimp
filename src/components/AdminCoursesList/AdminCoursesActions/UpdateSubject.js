import React, {useContext, useState, useEffect, useRef} from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import {updateSubject} from "../../../redux/actions/coursesActions";
import {connect} from "react-redux";

const Modal = React.lazy(() => import('../../UI/Modal/Modal'));
const Form = React.lazy(() => import('../../Form/Form'));

// === Need to move this to a separate file from all the files it's used in
function usePrevious(value) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

function UpdateSubject({subject, loading, setShowUpdateSubject, updateSubject}) {
    const { translate, getSubjectFields } = useContext(siteSettingsContext);
    const [ subjectFields, setSubjectFields ] = useState(JSON.stringify(getSubjectFields(subject)));
    const prevSubject = usePrevious(subject);
    const [ formUpdated, setFormUpdated ] = useState(false);

    useEffect(() => {
        if ( prevSubject && subject && JSON.stringify(prevSubject) !== JSON.stringify(subject) ) {
            toggleModal();
        }
    });

    return (
        <Modal onHideModal={() => toggleModal()}>
            <Form loading={loading} heading={translate('edit_subject')} fields={JSON.parse(subjectFields)} setFieldValue={setFieldValue} formAction={handleEditSubject} formUpdated={formUpdated}/>
        </Modal>
    );

    function toggleModal() {
        setShowUpdateSubject(false);
    }

    function handleEditSubject() {
        const newSubjectFields = JSON.parse(subjectFields);
        const newSubject = {};

        newSubject.name = {
            en: newSubjectFields.find(item => item.id === 'subjectName_en').value,
            ru: newSubjectFields.find(item => item.id === 'subjectName_ru').value,
            ua: newSubjectFields.find(item => item.id === 'subjectName_ua').value
        };
        newSubject.id = subject.id;

        updateSubject(newSubject);
    }

    function setFieldValue(fieldID, value) {
        const newSubjectFields = JSON.parse(subjectFields);

        newSubjectFields.find(item => item.id === fieldID).value = value;
        newSubjectFields.find(item => item.id === fieldID).updated = true;

        setFormUpdated(true);

        setSubjectFields(JSON.stringify(newSubjectFields));
    }
}
const mapDispatchToProps = dispatch => ({
    updateSubject: (subject) => dispatch(updateSubject(subject))
});
export default connect(null, mapDispatchToProps)(UpdateSubject);