import React, { useContext, useState } from 'react';
import TagsList from "../../components/UI/TagsList/TagsList";
import siteSettingsContext from "../../context/siteSettingsContext";
import Modal from "../../components/UI/Modal/Modal";
import Form from "../../components/Form/Form";
import {updateDoc} from "../../redux/actions/libraryActions";
import {connect} from "react-redux";

function AdminLibraryItem({item, setTags, onDeleteDoc, loading, updateDoc}) {
    const { translate, getDocFormFields } = useContext(siteSettingsContext);
    const [ showModal, setShowModal ] = useState(false);
    const [ docItem, setDocItem ] = useState(JSON.stringify(item));
    const [ initialDocItem ] = useState(JSON.stringify(item));

    // === Need to move this to context
    const itemFields = getDocFormFields(JSON.parse(docItem).name, JSON.parse(docItem).tags, translate('update'));

    return (
        <tr className="table__body-row">
            <td className="table__body-cell">
                <div className="table__ellipsis">
                    <a href="/" title={JSON.parse(docItem).name}>
                        <i className="content_title-icon fa fa-external-link-alt" />
                        { JSON.parse(docItem).name }
                    </a>
                </div>
            </td>
            <td className="table__body-cell">
                <TagsList tagsList={JSON.parse(docItem).tags} setTags={setTags} />
            </td>
            <td className="table__body-cell">
                <div className="table__actions">
                    <a href="/" className="table__actions-btn" onClick={e => onSetShowModal(e)}>
                        <i className="content_title-icon fa fa-pencil-alt" />
                        { translate('edit') }
                    </a>
                    <a href="/" className="table__actions-btn table__actions-btn-error" onClick={e => onDeleteDoc(e, JSON.parse(docItem))}>
                        <i className="content_title-icon fa fa-trash-alt" />
                        { translate('delete') }
                    </a>
                </div>
                {
                    showModal ?
                        <>
                            <Modal onHideModal={onHideModal}>
                                <Form heading={translate('edit_doc')} fields={itemFields} formAction={handleUpdateFile} setFieldValue={setFieldValue} loading={loading} />
                            </Modal>
                        </>
                        :
                        null
                }
            </td>
        </tr>
    );

    function setFieldValue(fieldID, value) {
        const newField = JSON.parse(docItem);

        newField[fieldID] = value;

        setDocItem(JSON.stringify(newField));
    }

    function onSetShowModal(e) {
        e.preventDefault();

        setShowModal(true);
    }

    function onHideModal() {
        setShowModal(false);
        setDocItem(initialDocItem);
    }

    function handleUpdateFile() {
        const newFile = JSON.parse(docItem);

        delete newFile.id;

        updateDoc(newFile, JSON.parse(docItem).id);
    }
}
const mapDispatchToProps = dispatch => ({
    updateDoc: (newFile, id) => dispatch(updateDoc(newFile, id))
});
export default connect(null, mapDispatchToProps)(AdminLibraryItem);