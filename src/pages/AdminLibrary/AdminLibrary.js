import React, { useContext, useState, useEffect, useRef } from 'react';
import {connect} from "react-redux";
import withFilters from "../../utils/withFilters";
import { fetchLibrary, deleteDoc, uploadDoc } from '../../redux/actions/libraryActions';
import siteSettingsContext from "../../context/siteSettingsContext";
import {Preloader} from "../../components/UI/preloader";
import withPager from "../../utils/withPager";
import withTags from '../../utils/withTags';
import Modal from '../../components/UI/Modal/Modal';
import Form from '../../components/Form/Form';
import generator from "generate-password";
import AdminLibraryList from "../../components/AdminLibraryList/AdminLibraryList";

function usePrevious(value) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

function AdminLibrary({loading, list, filters, searchQuery, pager, setTags, selectedTags, deleteDoc, uploadDoc}) {
    const { translate, getDocFormFields } = useContext(siteSettingsContext);
    const $fileRef = React.createRef();
    const [ showModal, setShowModal ] = useState(false);
    const [ newFile, setFile ] = useState({
        name: '',
        tags: []
    });
    const uploadFields = getDocFormFields(newFile.name, newFile.tags, translate('upload'));
    const prevList = usePrevious(list);

    useEffect(() => {
        if ( JSON.stringify(prevList) !== JSON.stringify(list) ) {
            setFile({name: '', tags: []});
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
                </div>
                { filters }
                <div className="adminLibrary__list widget">
                    {
                        list ?
                            list.length ?
                                <>
                                    { selectedTags }
                                    <AdminLibraryList list={filterList()} loading={loading} onDeleteDoc={onDeleteDoc} setTags={setTags}/>
                                    { pager }
                                </>
                                :
                                <div className="nothingFound">
                                    <a href="/" className="btn btn_primary" onClick={e => onUploadFile(e)}>
                                        <i className="content_title-icon fa fa-cloud-upload-alt" />
                                        { translate('upload') }
                                    </a>
                                </div>
                            :
                            <Preloader/>
                    }
                </div>
            </div>
        </div>
    );

    function filterList() {
        return list.filter(item => searchQuery.trim().length ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true);
    }

    function onDeleteDoc(e, doc) {
        e.preventDefault();

        if ( window.confirm(translate('sure_to_delete_doc')) ) {
            deleteDoc(doc.id, doc.ref);
        }
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
    list: state.libraryReducer.libraryList,
    loading: state.libraryReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchLibrary: dispatch(fetchLibrary()),
    deleteDoc: (docID, docRef) => dispatch(deleteDoc(docID, docRef)),
    uploadDoc: (newFile, file, id) => dispatch(uploadDoc(newFile, file, id))
});
export default connect(mapStateToProps, mapDispatchToProps)(withFilters(withPager(withTags(AdminLibrary)), true, true));