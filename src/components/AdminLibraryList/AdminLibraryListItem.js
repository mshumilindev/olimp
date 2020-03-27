import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import TagsList from "../UI/TagsList/TagsList";
import siteSettingsContext from "../../context/siteSettingsContext";
import Modal from "../UI/Modal/Modal";
import Form from "../Form/Form";
import {updateDoc, downloadDoc} from "../../redux/actions/libraryActions";
import {connect} from "react-redux";
import classNames from "classnames";
import userContext from "../../context/userContext";

function usePrevious(value) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

function AdminLibraryListItem({item, setTags, onDeleteDoc, loading, updateDoc, downloadDoc, users, isCurrent}) {
    const { translate, getDocFormFields } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);
    const [ showModal, setShowModal ] = useState(false);
    const [ isUsed, setIsUsed ] = useState(false);
    const [ docItem, setDocItem ] = useState(JSON.stringify(item));
    const [ initialDocItem, setInitialDocItem ] = useState(JSON.stringify(item));
    const [ formUpdated, setFormUpdated ] = useState(false);
    const prevItem = usePrevious(item);

    // === Need to move this to context
    const itemFields = getDocFormFields(JSON.parse(docItem).name, JSON.parse(docItem).tags, JSON.parse(docItem).teacher, translate('update'));

    useEffect(() => {
        if ( JSON.stringify(prevItem) !== JSON.stringify(item) ) {
            setDocItem(JSON.stringify(item));
            setInitialDocItem(JSON.stringify(item));
            setShowModal(false);
            setIsUsed(false);
        }
    }, [item]);

    return (
        <tr className={classNames('table__body-row', {current: isCurrent, isUsed: isUsed})}>
            <td className="table__body-cell">
                <div className="table__ellipsis">
                    <a href="/" title={JSON.parse(docItem).name} onClick={e => onDownloadFile(e)}>
                        <i className="content_title-icon fa fa-external-link-alt" />
                        { JSON.parse(docItem).name }
                    </a>
                </div>
            </td>
            <td className="table__body-cell">
                <TagsList tagsList={JSON.parse(docItem).tags} setTags={setTags} />
            </td>
            <td className="table__body-cell">
                {
                    JSON.parse(docItem).teacher ?
                        <Link to={'/admin-users/' + getTeacher(JSON.parse(docItem).teacher).login}><i className="fa fa-user content_title-icon"/>{ getTeacher(JSON.parse(docItem).teacher).name }</Link>
                        :
                        null
                }
            </td>
            <td className="table__body-cell">
                {
                    JSON.parse(docItem).teacher && JSON.parse(docItem).teacher !== user.id && user.role !== 'admin' ?
                        null
                        :
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
                }
                {
                    showModal ?
                        <>
                            <Modal onHideModal={onHideModal}>
                                <Form heading={translate('edit_doc')} fields={itemFields} formAction={handleUpdateFile} setFieldValue={setFieldValue} loading={loading} formUpdated={formUpdated} />
                            </Modal>
                        </>
                        :
                        null
                }
            </td>
        </tr>
    );

    function getTeacher(userID) {
        return users.length ? users.find(userItem => userItem.id === userID) : '';
    }

    function setFieldValue(fieldID, value) {
        const newField = JSON.parse(docItem);

        newField[fieldID] = value;
        newField.updated = true;

        setFormUpdated(true);

        setDocItem(JSON.stringify(newField));
    }

    function onSetShowModal(e) {
        e.preventDefault();

        setIsUsed(true);
        setShowModal(true);
    }

    function onHideModal() {
        setShowModal(false);
        setIsUsed(false);
        setDocItem(initialDocItem);
    }

    function handleUpdateFile() {
        const newFile = JSON.parse(docItem);

        if ( !newFile.teacher ) {
            newFile.teacher = '';
        }

        delete newFile.id;

        updateDoc(newFile, JSON.parse(docItem).id);
    }

    function onDownloadFile(e) {
        e.preventDefault();

        downloadDoc(JSON.parse(docItem).ref);
    }
}

const mapDispatchToProps = dispatch => ({
    updateDoc: (newFile, id) => dispatch(updateDoc(newFile, id)),
    downloadDoc: (ref) => dispatch(downloadDoc(ref))
});
export default connect(null, mapDispatchToProps)(AdminLibraryListItem);