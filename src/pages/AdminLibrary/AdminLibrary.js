import React, {useCallback, useContext, useEffect, useState} from 'react';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import {deleteDoc, uploadDoc} from '../../redux/actions/libraryActions';
import siteSettingsContext from "../../context/siteSettingsContext";
import Modal from '../../components/UI/Modal/Modal';
import Form from '../../components/Form/Form';
import generator from "generate-password";
import AdminLibraryList from "../../components/AdminLibraryList/AdminLibraryList";
import withFilters from "../../utils/withFilters";
import withTags from "../../utils/withTags";
import Preloader from "../../components/UI/preloader";
import './adminLibrary.scss';

import Confirm from '../../components/UI/Confirm/Confirm';

function AdminLibrary({user, loading, libraryList, setTags, searchQuery, deleteDoc, uploadDoc, usersList, filters, showPerPage, showOnlyMy, selectedTags}) {
  // console.log(booksList);

  // return (
  //   <div>
  //     {
  //       booksList?.map((book) => {
  //         return book.metadata.name;
  //       })
  //     }
  //   </div>
  // )
    const { translate, getDocFormFields } = useContext(siteSettingsContext);
    const $fileRef = React.createRef();
    const [ showModal, setShowModal ] = useState(false);
    const [ newFile, setFile ] = useState({
        name: '',
        tags: [],
        teacher: user.role ==='teacher' ? [user.id] : []
    });
    const uploadFields = getDocFormFields(newFile.name, newFile.tags, newFile.teacher, translate('upload'));
    const [ showConfirmRemove, setShowConfirmRemove ] = useState(false);
    const [ docToDelete, setDocToDelete ] = useState(null);

    const onConfirmRemove = useCallback(() => {
        deleteDoc(docToDelete.id, docToDelete.ref);
        setDocToDelete(null);
        setShowConfirmRemove(false);
    }, [deleteDoc, setDocToDelete, setShowConfirmRemove, docToDelete]);

    const onDeleteDoc = useCallback((e, doc) => {
        e.preventDefault();

        setDocToDelete(doc);
        setShowConfirmRemove(true);
    }, [setDocToDelete, setShowConfirmRemove]);

    const onUploadFile = useCallback((e) => {
        e.preventDefault();
        $fileRef.current.click();
    }, [$fileRef]);

    const fileChanged = useCallback(() => {
        const file = $fileRef.current.files[0];

        setFile({
            ...newFile,
            name: file.name
        });
        setShowModal(true);
    }, [$fileRef, setFile, newFile, setShowModal]);

    const setFieldValue = useCallback((fieldID, value) => {
        setFile({
            ...newFile,
            [fieldID]: value
        });
    }, [setFile, newFile]);

    const handleUploadFile = useCallback(() => {
        const newID = generator.generate({
            length: 16
        });
        uploadDoc(newFile, $fileRef.current.files[0], newID);
        setFile({name: '', tags: [], teacher: user.role ==='teacher' ? user.id : ''});
        setShowModal(false);

        if ( $fileRef.current ) {
            $fileRef.current.value = '';
        }
    }, [uploadDoc, $fileRef, newFile, setFile, user, setShowModal]);

    const onHideModal = useCallback(() => {
        $fileRef.current.value = '';
        setShowModal(false);
        setFile({
            name: '',
            tags: []
        });
    }, [$fileRef, setShowModal, setFile]);

    const filterList = useCallback(() => {
        return user.role === 'admin' ? libraryList : libraryList?.filter((item) => showOnlyMy ? (item.teacher && (item.teacher === user.id || item.teacher.indexOf(user.id) !== -1)) : true)?.filter(item => searchQuery && searchQuery.trim().length ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true) || null;
    }, [libraryList, searchQuery, user, showOnlyMy]);

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
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className="content_title-icon fa fa-bookmark" />
                        { translate('library') }
                    </h2>
                    <div className="section__title-actions">
                        <a href="/" className="btn btn_primary" onClick={e => onUploadFile(e)}>
                            <i className="content_title-icon fa fa-cloud-upload-alt" />
                            { translate('upload') }
                        </a>
                    </div>
                    {
                        !libraryList ?
                            <Preloader size={60}/>
                            :
                            null
                    }
                </div>
                { filters }
                <AdminLibraryList list={filterList()} loading={loading} onDeleteDoc={onDeleteDoc} setTags={setTags} users={usersList} onUploadFile={onUploadFile} showPerPage={showPerPage} selectedTags={selectedTags}/>
            </div>
            {
                showConfirmRemove ?
                    <Confirm message={translate('sure_to_delete_doc')} confirmAction={onConfirmRemove} cancelAction={() => setShowConfirmRemove(false)}/>
                    :
                    null
            }
        </div>
    );
}
const mapStateToProps = state => ({
    usersList: state.usersReducer.usersList,
    libraryList: state.libraryReducer.libraryList,
    loading: state.libraryReducer.loading,
    user: state.authReducer.currentUser
});
const mapDispatchToProps = dispatch => ({
    deleteDoc: (docID, docRef) => dispatch(deleteDoc(docID, docRef)),
    uploadDoc: (newFile, file, id) => dispatch(uploadDoc(newFile, file, id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withFilters(withTags(withRouter(AdminLibrary)), true, true, null, null, 'teacher'));
