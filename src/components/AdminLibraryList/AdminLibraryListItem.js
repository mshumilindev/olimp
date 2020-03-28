import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import TagsList from "../UI/TagsList/TagsList";
import siteSettingsContext from "../../context/siteSettingsContext";
import Modal from "../UI/Modal/Modal";
import Form from "../Form/Form";
import {updateDoc, downloadDoc} from "../../redux/actions/libraryActions";
import {connect} from "react-redux";
import classNames from "classnames";
import userContext from "../../context/userContext";

function AdminLibraryListItem({item, setTags, onDeleteDoc, loading, updateDoc, downloadDoc, users, isCurrent}) {
    const { translate, getDocFormFields } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);
    const [ showModal, setShowModal ] = useState(false);
    const [ isUsed, setIsUsed ] = useState(false);
    const [ formUpdated, setFormUpdated ] = useState(false);
    const [ itemFields, setItemFields ] = useState(getDocFormFields(item.name, item.tags, item.teacher, translate('update')));

    return (
        <tr className={classNames('table__body-row', {current: isCurrent, isUsed: isUsed})}>
            <td className="table__body-cell">
                <div className="table__ellipsis">
                    <a href="/" title={item.name} onClick={e => onDownloadFile(e)}>
                        <i className="content_title-icon fa fa-external-link-alt" />
                        { item.name }
                    </a>
                </div>
            </td>
            <td className="table__body-cell">
                <TagsList tagsList={item.tags} setTags={setTags} />
            </td>
            <td className="table__body-cell">
                { _renderTeachers() }
            </td>
            <td className="table__body-cell">
                {
                    item.teacher && item.teacher !== user.id && user.role !== 'admin' ?
                        null
                        :
                        <div className="table__actions">
                            <a href="/" className="table__actions-btn" onClick={e => onSetShowModal(e)}>
                                <i className="content_title-icon fa fa-pencil-alt" />
                                { translate('edit') }
                            </a>
                            <a href="/" className="table__actions-btn table__actions-btn-error" onClick={e => handleDeleteFile(e)}>
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

    function _renderTeachers() {
        return (
            <div className="adminLibrary__list-teachers">
                {
                    item.teacher ?
                        typeof item.teacher === 'object' ?
                            item.teacher.map(teacher => _renderTeacherItem(teacher))
                            :
                            _renderTeacherItem(item.teacher)
                        :
                        null
                }
            </div>
        )
    }

    function _renderTeacherItem(teacher) {
        return (
            <Link to={'/admin-users/' + getTeacher(teacher).login} key={teacher}><i className="fa fa-user content_title-icon"/>{ getTeacher(teacher).name }</Link>
        )
    }

    function getTeacher(userID) {
        return users.length ? users.find(userItem => userItem.id === userID) : '';
    }

    function setFieldValue(fieldID, value) {
        const newFields = Object.assign([], itemFields);

        if ( fieldID === 'teacher' ) {
            newFields.find(newFieldItem => newFieldItem.id === 'teacher_block').children[0].value = (value || '');
        }
        else {
            newFields.find(newFieldItem => newFieldItem.id === fieldID).value = value;
        }

        newFields.updated = true;

        setItemFields(newFields);
        setFormUpdated(true);
    }

    function onSetShowModal(e) {
        e.preventDefault();

        setIsUsed(true);
        setShowModal(true);
    }

    function onHideModal() {
        setShowModal(false);
        setIsUsed(false);
        resetItem();
    }

    function handleUpdateFile() {
        const newFile = item;

        if ( !newFile.teacher ) {
            newFile.teacher = '';
        }

        newFile.name = itemFields.find(fieldItem => fieldItem.id === 'name').value;
        newFile.tags = itemFields.find(fieldItem => fieldItem.id === 'tags').value;
        newFile.teacher = itemFields.find(newFieldItem => newFieldItem.id === 'teacher_block').children[0].value;

        delete newFile.updated;

        updateDoc(newFile, item.id);
        resetItem();
    }

    function handleDeleteFile(e) {
        onDeleteDoc(e, item);
        resetItem();
    }

    function onDownloadFile(e) {
        e.preventDefault();

        downloadDoc(item.ref);
    }

    function resetItem() {
        setShowModal(false);
        setIsUsed(false);
        setItemFields(getDocFormFields(item.name, item.tags, item.teacher, translate('update')));
    }
}

const mapDispatchToProps = dispatch => ({
    updateDoc: (newFile, id) => dispatch(updateDoc(newFile, id)),
    downloadDoc: (ref) => dispatch(downloadDoc(ref))
});
export default connect(null, mapDispatchToProps)(AdminLibraryListItem);