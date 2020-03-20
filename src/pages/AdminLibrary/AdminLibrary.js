import React, { useContext, useState, useEffect, useRef } from 'react';
import {connect} from "react-redux";
import {fetchLibrary, deleteDoc, uploadDoc} from '../../redux/actions/libraryActions';
import siteSettingsContext from "../../context/siteSettingsContext";
import Modal from '../../components/UI/Modal/Modal';
import Form from '../../components/Form/Form';
import generator from "generate-password";
import AdminLibraryList from "../../components/AdminLibraryList/AdminLibraryList";
import userContext from "../../context/userContext";

const Confirm = React.lazy(() => import('../../components/UI/Confirm/Confirm'));

function usePrevious(value) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

function AdminLibrary({loading, list, setTags, deleteDoc, uploadDoc, usersList}) {
    const { translate, getDocFormFields } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);
    const $fileRef = React.createRef();
    const [ showModal, setShowModal ] = useState(false);
    const [ newFile, setFile ] = useState({
        name: '',
        tags: [],
        teacher: user.role ==='teacher' ? user.id : ''
    });
    const uploadFields = getDocFormFields(newFile.name, newFile.tags, newFile.teacher, translate('upload'));
    const prevList = usePrevious(list);
    const [ showConfirmRemove, setShowConfirmRemove ] = useState(false);
    const [ docToDelete, setDocToDelete ] = useState(null);

    useEffect(() => {
        if ( JSON.stringify(prevList) !== JSON.stringify(list) ) {
            setFile({name: '', tags: [], teacher: user.role ==='teacher' ? user.id : ''});
            setShowModal(false);

            if ( $fileRef.current ) {
                $fileRef.current.value = '';
            }
        }
    });

    return (
        <div className="adminLibrary">
            <input type="file" hidden ref={$fileRef} onChange={e => fileChanged(e)} accept="application/pdf"/>
            {
                showModal ?
                    <>
                        <Modal onHideModal={onHideModal}>
                            <Form heading={translate('upload_doc')} fields={uploadFields} formAction={handleUploadFile} setFieldValue={setFieldValue} loading={loading} />
                        </Modal>
                    </>
                    :
                    null
            }
            <div className="section">
                <AdminLibraryList list={list.filter(item => user.role === 'teacher' ? item.teacher === user.id : true)} loading={loading} onDeleteDoc={onDeleteDoc} setTags={setTags} users={usersList} onUploadFile={onUploadFile}/>
            </div>
            {
                showConfirmRemove ?
                    <Confirm message={translate('sure_to_delete_doc')} confirmAction={onConfirmRemove} cancelAction={() => setShowConfirmRemove(false)}/>
                    :
                    null
            }
        </div>
    );

    function onConfirmRemove() {
        deleteDoc(docToDelete.id, docToDelete.ref);
        setDocToDelete(null);
        setShowConfirmRemove(false);
    }

    function onDeleteDoc(e, doc) {
        e.preventDefault();

        setDocToDelete(doc);
        setShowConfirmRemove(true);
    }

    function onUploadFile(e) {
        e.preventDefault();
        $fileRef.current.click();
    }

    function fileChanged() {
        const file = $fileRef.current.files[0];
        setFile({
            ...newFile,
            name: file.name
        });
        setShowModal(true);
    }

    function setFieldValue(fieldID, value) {
        setFile({
            ...newFile,
            [fieldID]: value
        });
    }

    function handleUploadFile() {
        const newID = generator.generate({
            length: 16
        });
        uploadDoc(newFile, $fileRef.current.files[0], newID);
    }

    function onHideModal() {
        $fileRef.current.value = '';
        setShowModal(false);
        setFile({
            name: '',
            tags: []
        });
    }
}
const mapStateToProps = state => ({
    usersList: state.usersReducer.usersList,
    list: state.libraryReducer.libraryList,
    loading: state.libraryReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchLibrary: dispatch(fetchLibrary()),
    deleteDoc: (docID, docRef) => dispatch(deleteDoc(docID, docRef)),
    uploadDoc: (newFile, file, id) => dispatch(uploadDoc(newFile, file, id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AdminLibrary);