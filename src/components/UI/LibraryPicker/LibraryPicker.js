import React, { useContext, useState, useEffect } from 'react';
import './libraryPicker.scss';
import siteSettingsContext from "../../../context/siteSettingsContext";
import {connect} from "react-redux";
import classNames from 'classnames';
import {fetchLibrary} from "../../../redux/actions/libraryActions";

const Modal = React.lazy(() => import('../Modal/Modal'));

function LibraryPicker({multiple, libraryList, addBooks, selectedList, noneditable, placeholder}) {
    const { translate } = useContext(siteSettingsContext);
    const [ showLibraryListModal, setShowLibraryListModal ] = useState(false);
    const [ initialSelectedBooks, setInitialSelectedBooks ] = useState(JSON.stringify(selectedList));
    const [ selectedBooks, setSelectedBooks ] = useState(JSON.stringify(selectedList));

    useEffect(() => {
        if ( showLibraryListModal && JSON.stringify(selectedList) !== initialSelectedBooks ) {
            handleHideModal();
        }
    });

    return (
        <div className="libraryPicker">
            {
                selectedList.length ?
                    <div className="libraryPicker__selectedList">
                        {
                            selectedList.sort((a, b) => {
                                const aName = libraryList.find(user => user.id === a).name;
                                const bName = libraryList.find(user => user.id === b).name;

                                if ( aName < bName ) {
                                    return -1;
                                }
                                if ( aName > bName ) {
                                    return 1;
                                }
                                else {
                                    return 0;
                                }
                            }).map(item => _renderSelectedBook(item))
                        }
                    </div>
                    :
                    <div className="nothingFound">
                        { translate('nothing_found') }
                    </div>
            }
            <div className="libraryPicker__add">
                <span className="libraryPicker__add-btn" onClick={() => setShowLibraryListModal(true)}>
                    {
                        selectedList.length ?
                            <i className="fa fa-pencil-alt" />
                            :
                            <i className="fa fa-plus" />
                    }
                    {
                        placeholder ?
                            <span className="libraryPicker__placeholder">
                                { placeholder }
                            </span>
                            :
                            null
                    }
                </span>
            </div>
            {
                showLibraryListModal ?
                    <Modal onHideModal={handleHideModal} heading={translate('new') + ' ' + translate('textbook')}>
                        <div className="libraryPicker__list">
                            {
                                libraryList && libraryList.length ?
                                    libraryList.map(item => _renderLibraryItem(item))
                                    :
                                    <div className="nothingFound">
                                        { translate('nothing_found') }
                                    </div>
                            }
                        </div>
                        {
                            libraryList.length ?
                                <div className="libraryPicker__list-btn">
                                    <a href="/" className="btn btn_primary" onClick={e => onAddBooks(e)}>
                                        {
                                            selectedList.length ?
                                                <>
                                                    <i className="content_title-icon fa fa-pencil-alt"/>
                                                    { translate('update') }
                                                </>
                                                :
                                                <>
                                                    <i className="content_title-icon fa fa-plus"/>
                                                    { translate('add') }
                                                </>
                                        }
                                    </a>
                                </div>
                                :
                                null
                        }
                    </Modal>
                    :
                    null
            }
        </div>
    );

    function _renderSelectedBook(bookID) {
        const book = libraryList.find(item => item.id === bookID);

        return (
            <div className={'libraryPicker__list-item selectedBookItem'} key={bookID}>
                <div className="libraryPicker__list-item-name">
                    <i className="content_title-icon fa fa-bookmark" />
                    { book.name }
                </div>
            </div>
        )
    }

    function _renderLibraryItem(book) {
        const booksList = JSON.parse(selectedBooks);

        return (
            <div className={classNames('userPicker__list-item', {selected: booksList.some(item => item === book.id)})} onClick={() => chooseBook(book.id)} key={book.id}>
                {
                    multiple ?
                        booksList.some(item => item === book.id) ?
                            <i className="userPicker__list-item-check far fa-check-square selected" />
                            :
                            <i className="userPicker__list-item-check far fa-square" />
                        :
                        booksList.some(item => item === book.id) ?
                            <i className="userPicker__list-item-check far fa-dot-circle selected" />
                            :
                            <i className="userPicker__list-item-check far fa-circle" />
                }
                <div className="userPicker__list-item-name">
                    { book.name }
                </div>
            </div>
        )
    }

    function chooseBook(bookID) {
        const booksList = JSON.parse(selectedBooks);

        booksList.splice(0, booksList.length);
        booksList.push(bookID);

        setSelectedBooks(JSON.stringify(booksList));
    }

    function onAddBooks(e) {
        e.preventDefault();

        addBooks('textbook', JSON.parse(selectedBooks));
    }

    function handleHideModal() {
        setSelectedBooks(JSON.stringify(selectedList));
        setInitialSelectedBooks(JSON.stringify(selectedList));
        setShowLibraryListModal(false);
    }
}

const mapStateToProps = state => ({
    libraryList: state.libraryReducer.libraryList,
    loading: state.libraryReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchLibrary: dispatch(fetchLibrary())
});
export default connect(mapStateToProps, mapDispatchToProps)(LibraryPicker);
