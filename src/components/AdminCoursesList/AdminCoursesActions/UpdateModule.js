import React, { useState, useContext, useEffect, useRef } from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import {updateModule} from "../../../redux/actions/coursesActions";

const Modal = React.lazy(() => import('../../UI/Modal/Modal'));
const Form = React.lazy(() => import('../../Form/Form'));

function usePrevious(value) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

function UpdateModule({history, params, subjectID, courseID, module, loading, setShowUpdateModule, updateModule}) {
    const { translate, getModuleFields, getModuleModel, identify, transliterize } = useContext(siteSettingsContext);
    const currentModule = module ? module : getModuleModel();
    const [ formUpdated, setFormUpdated ] = useState(false);
    const [ moduleFields, setModuleFields ] = useState(JSON.stringify(getModuleFields(currentModule)));
    const prevLoading = usePrevious(loading);

    useEffect(() => {
        if ( prevLoading === true && loading === false ) {
            if ( !params || !params.courseID || params.courseID !== courseID ) {
                history.push(history.location.pathname + '/' + subjectID + '/' + courseID);
            }
            else {
                setShowUpdateModule(false);
            }
        }
    });

    return (
        <Modal onHideModal={() => toggleModal()}>
            <Form loading={loading} heading={module ? translate('edit_module') : translate('create_module')} fields={JSON.parse(moduleFields)} setFieldValue={setFieldValue} formAction={handleEditModule} formUpdated={formUpdated}/>
        </Modal>
    );

    function handleEditModule() {
        const newModuleFields = JSON.parse(moduleFields);
        const newModule = {};

        newModule.name = {
            en: newModuleFields.find(item => item.id === 'moduleName_en').value,
            ru: newModuleFields.find(item => item.id === 'moduleName_ru').value,
            ua: newModuleFields.find(item => item.id === 'moduleName_ua').value
        };
        newModule.id = module ? module.id : identify(transliterize(newModule.name['ua']));
        newModule.index = module ? module.index : moment().unix();

        updateModule(subjectID, courseID, newModule);
    }

    function toggleModal() {
        setShowUpdateModule(false);
    }

    function setFieldValue(fieldID, value) {
        const newModuleFields = JSON.parse(moduleFields);

        newModuleFields.find(item => item.id === fieldID).value = value;
        newModuleFields.find(item => item.id === fieldID).updated = true;

        setFormUpdated(true);

        setModuleFields(JSON.stringify(newModuleFields));
    }
}
const mapDispatchToProps = dispatch => ({
    updateModule: (subjectID, courseID, module) => dispatch(updateModule(subjectID, courseID, module))
});
export default connect(null, mapDispatchToProps)(withRouter(UpdateModule));