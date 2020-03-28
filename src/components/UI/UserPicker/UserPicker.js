import React, { useContext, useState, useEffect } from 'react';
import './userPicker.scss';
import siteSettingsContext from "../../../context/siteSettingsContext";
import {connect} from "react-redux";
import withFilters from "../../../utils/withFilters";
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import Modal from "../Modal/Modal";

function UserPicker({type, multiple, usersList, searchQuery, filters, addUsers, selectedList, noneditable, noSearch, placeholder, classesList, required, hasErrors, exclude}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ showUserListModal, setShowUserListModal ] = useState(false);
    const [ selectedUsers, setSelectedUsers ] = useState(selectedList);

    useEffect(() => {
        setSelectedUsers(Object.assign([], selectedList));
    }, [selectedList]);

    return (
        <div className={classNames('userPicker', {hasErrors: hasErrors})}>
            <input type="hidden" value={selectedList.toString()} className={classNames({required: required})}/>
            {
                selectedList.length ?
                    <div className="userPicker__selectedList">
                        {
                            selectedList.sort((a, b) => {
                                const aName = usersList.find(user => user.id === a).name;
                                const bName = usersList.find(user => user.id === b).name;

                                if ( aName < bName ) {
                                    return -1;
                                }
                                if ( aName > bName ) {
                                    return 1;
                                }
                                else {
                                    return 0;
                                }
                            }).map(item => renderSelectedUser(item))
                        }
                    </div>
                    :
                    <div className="nothingFound">
                        { translate('nothing_found') }
                    </div>
            }
            {
                !noneditable ?
                    <div className="userPicker__add">
                        <span className="userPicker__add-btn" onClick={() => setShowUserListModal(true)}>
                            {
                                selectedList.length ?
                                    <i className="fa fa-pencil-alt" />
                                    :
                                    <i className="fa fa-plus" />
                            }
                            {
                                placeholder ?
                                    <span className="userPicker__placeholder">
                                        { placeholder }
                                    </span>
                                    :
                                    null
                            }
                        </span>
                    </div>
                    :
                    null
            }
            {
                showUserListModal ?
                    <Modal onHideModal={handleHideModal} heading={translate('new') + ' ' + translate(type)}>
                        {
                            noSearch ?
                                null
                                :
                                <div className="userPicker__filters">
                                    { filters }
                                </div>
                        }
                        <div className="userPicker__list">
                            <Scrollbars
                                autoHeight
                                hideTracksWhenNotNeeded
                                autoHeightMax={500}
                                renderTrackVertical={props => <div {...props} className="scrollbar__track"/>}
                                renderView={props => <div {...props} className="scrollbar__content"/>}
                            >
                                {
                                    usersList && filterUsers().length ?
                                        filterUsers().map(user => renderUser(user))
                                        :
                                        <div className="nothingFound">
                                            { translate('nothing_found') }
                                        </div>
                                }
                            </Scrollbars>
                        </div>
                        {
                            filterUsers().length ?
                                <div className="userPicker__list-btn">
                                    <a href="/" className="btn btn_primary" onClick={e => onAddUsers(e)}>
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

    function renderSelectedUser(userID) {
        const user = usersList.find(item => item.id === userID);

        return (
            <div className={classNames('userPicker__list-item selectedUserItem ' + type, { multiple: multiple && selectedList.length > 1 })} key={userID}>
                <div className="userPicker__list-item-avatar" style={{backgroundImage: 'url(' + user.avatar + ')'}}>
                    {
                        !user.avatar ?
                            <div className="userPicker__list-item-avatar-placeholder">
                                <i className="fa fa-user"/>
                            </div>
                            :
                            null
                    }
                </div>
                <div className="userPicker__list-item-name">
                    <Link to={'/admin-users/' + user.login}>{ user.name }</Link>
                </div>
                {
                    !noneditable ?
                        <span className="userPicker__list-item-remove" onClick={() => quickRemoveUser(userID)}>
                            <i className="fa fa-trash-alt"/>
                        </span>
                        :
                        null
                }
            </div>
        )
    }

    function quickRemoveUser(userID) {
        const usersList = selectedUsers;

        usersList.splice(usersList.indexOf(usersList.find(user => user === userID)), 1);

        addUsers(type, usersList);
    }

    function handleHideModal() {
        setSelectedUsers(Object.assign([], selectedList));
        setShowUserListModal(false);
    }

    function renderUser(user) {
        const usersList = selectedUsers;

        return (
            <div className={classNames('userPicker__list-item', {selected: usersList.some(item => item === user.id)})} onClick={() => chooseUser(user.id)} key={user.id}>
                {
                    multiple ?
                        usersList.some(item => item === user.id) ?
                            <i className="userPicker__list-item-check far fa-check-square selected" />
                            :
                            <i className="userPicker__list-item-check far fa-square" />
                        :
                        usersList.some(item => item === user.id) ?
                            <i className="userPicker__list-item-check far fa-dot-circle selected" />
                            :
                            <i className="userPicker__list-item-check far fa-circle" />
                }
                <div className="userPicker__list-item-avatar" style={{backgroundImage: 'url(' + user.avatar + ')'}}>
                    {
                        !user.avatar ?
                            <div className="userPicker__list-item-avatar-placeholder">
                                <i className="fa fa-user"/>
                            </div>
                            :
                            null
                    }
                </div>
                <div className="userPicker__list-item-name">
                    { user.name }
                    {
                        user.class ?
                            ` - ${classesList.find(item => item.id === user.class).title[lang] ? classesList.find(item => item.id === user.class).title[lang] : classesList.find(item => item.id === user.class).title['ua']}`
                            :
                            null
                    }
                </div>
            </div>
        )
    }

    function chooseUser(userID) {
        const usersList = Object.assign([], selectedUsers);

        if ( multiple ) {
            if ( usersList.some(user => user === userID) ) {
                usersList.splice(usersList.indexOf(usersList.find(user => user === userID)), 1);
            }
            else {
                usersList.push(userID);
            }
        }
        else {
            usersList.splice(0, usersList.length);
            usersList.push(userID);
        }
        setSelectedUsers(usersList);
    }

    function onAddUsers(e) {
        e.preventDefault();

        addUsers(type, selectedUsers);
        handleHideModal();
    }

    function filterUsers() {
        return usersList.filter(user => exclude ? exclude.indexOf(user.id) === -1 : true).filter(user => (type !== 'teacher' && type !== 'admin' && type !== 'student') || user.role === type && user.status === 'active').filter(user => {
            if ( searchQuery ) {
                if ( user.name.toLowerCase().includes(searchQuery.toLowerCase()) ) {
                    return user;
                }
            }
            else {
                return user;
            }
            return user;
        }).sort((a, b) => {
            if ( a.name < b.name ) {
                return -1;
            }
            else if ( a.name > b.name ) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }
}

const mapStateToProps = state => ({
    usersList: state.usersReducer.usersList,
    loading: state.usersReducer.loading,
    classesList: state.classesReducer.classesList
});
export default connect(mapStateToProps)(withFilters(UserPicker, true));
