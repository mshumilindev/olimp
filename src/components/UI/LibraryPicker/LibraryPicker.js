import React, { useContext, useState, useEffect } from 'react';
import './libraryPicker.scss';
import siteSettingsContext from "../../../context/siteSettingsContext";
import {connect} from "react-redux";
import classNames from 'classnames';
import {fetchLibrary} from "../../../redux/actions/libraryActions";
import userContext from "../../../context/userContext";
import { Scrollbars } from 'react-custom-scrollbars';
import withFilters from "../../../utils/withFilters";

const Modal = React.lazy(() => import('../Modal/Modal'));

function LibraryPicker({multiple, libraryList, addBooks, selectedList, placeholder, filters, searchQuery}) {
    const { translate } = useContext(siteSettingsContext);
    const [ showLibraryListModal, setShowLibraryListModal ] = useState(false);
    const [ selectedBooks, setSelectedBooks ] = useState(selectedList);
    const { user } = useContext(userContext);

    useEffect(() => {
        return () => {
            setShowLibraryListModal(false);
        }
    }, []);

    useEffect(() => {
        setSelectedBooks(Object.assign([], selectedList));
    }, [selectedList]);

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
                        { translate('no_textbook') }
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
                    <Modal onHideModal={() => setShowLibraryListModal(false)} heading={translate('new') + ' ' + translate('textbook')}>
                        <div className="userPicker__filters">
                            { filters }
                        </div>
                        <div className="libraryPicker__list">
                            <Scrollbars
                                autoHeight
                                hideTracksWhenNotNeeded
                                autoHeightMax={500}
                                renderTrackVertical={props => <div {...props} className="scrollbar__track"/>}
                                renderView={props => <div {...props} className="scrollbar__content"/>}
                            >
                                {
                                    libraryList && libraryList.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).filter(item => user.role === 'admin' || item.teacher === user.id).length ?
                                        libraryList.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).filter(item => user.role === 'admin' || item.teacher === user.id).map(item => _renderLibraryItem(item))
                                        :
                                        <div className="nothingFound">
                                            { translate('nothing_found') }
                                        </div>
                                }
                            </Scrollbars>
                        </div>
                        {
                            libraryList.filter(item => user.role === 'admin' || item.teacher === user.id).length ?
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

        if ( !libraryList.find(item => item.id === bookID) ) {
            return null;
        }

        return (
            <div className={'libraryPicker__list-item selectedBookItem'} key={bookID}>
                <div className="libraryPicker__list-item-name">
                    <i className="content_title-icon fa fa-bookmark" />
                    { book.name }
                </div>
                <span className="libraryPicker__list-item-remove" onClick={() => quickRemoveBook(book.id)}>
                    <i className="fa fa-trash-alt"/>
                </span>
            </div>
        )
    }

    function _renderLibraryItem(book) {
        const booksList = selectedBooks;

        return (
            <div className={classNames('libraryPicker__list-item', {selected: booksList.some(item => item === book.id)})} onClick={() => chooseBook(book.id)} key={book.id}>
                {
                    multiple ?
                        booksList.some(item => item === book.id) ?
                            <i className="libraryPicker__list-item-check far fa-check-square selected" />
                            :
                            <i className="libraryPicker__list-item-check far fa-square" />
                        :
                        booksList.some(item => item === book.id) ?
                            <i className="libraryPicker__list-item-check far fa-dot-circle selected" />
                            :
                            <i className="libraryPicker__list-item-check far fa-circle" />
                }
                <div className="libraryPicker__list-item-name" title={book.name}>
                    { book.name }
                </div>
            </div>
        )
    }

    function quickRemoveBook(bookID) {
        let booksList = selectedBooks;

        if ( booksList.length > 1 ) {
            addBooks('textbook', Object.assign([], booksList.filter(item => item !== bookID)));
        }
        else {
            addBooks('textbook', Object.assign([],[]));
        }
    }

    function chooseBook(bookID) {
        let booksList = selectedBooks;

        if ( booksList.indexOf(bookID) !== -1 ) {
            if ( booksList.length > 1 ) {
                booksList = booksList.filter(item => item !== bookID);
            }
            else {
                booksList = [];
            }
        }
        else {
            booksList.push(bookID);
        }

        setSelectedBooks(Object.assign([], booksList));
    }

    function onAddBooks(e) {
        e.preventDefault();

        addBooks('textbook', selectedBooks);
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
export default connect(mapStateToProps, mapDispatchToProps)(withFilters(LibraryPicker, true));
