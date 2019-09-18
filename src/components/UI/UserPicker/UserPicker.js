import React, { useContext, useState, useEffect } from 'react';
import './userPicker.scss';
import siteSettingsContext from "../../../context/siteSettingsContext";
import {connect} from "react-redux";
import withFilters from "../../../utils/withFilters";
import classNames from 'classnames';

const Modal = React.lazy(() => import('../Modal/Modal'));

function UserPicker({type, multiple, usersList, searchQuery, filters, addUsers, selectedList, noneditable}) {
    const { translate } = useContext(siteSettingsContext);
    const [ showUserListModal, setShowUserListModal ] = useState(false);
    const [ initialSelectedUsers, setInitialSelectedUsers ] = useState(JSON.stringify(selectedList));
    const [ selectedUsers, setSelectedUsers ] = useState(JSON.stringify(selectedList));

    useEffect(() => {
        if ( showUserListModal && JSON.stringify(selectedList) !== initialSelectedUsers ) {
            handleHideModal();
        }
    });

    return (
        <div className="userPicker">
            {
                selectedList.length ?
                    <div className="userPicker__selectedList">
                        {
                            selectedList.map(item => renderSelectedUser(item))
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
                        </span>
                    </div>
                    :
                    null
            }
            {
                showUserListModal ?
                    <Modal onHideModal={handleHideModal} heading={translate('new') + ' ' + translate(type)}>
                        <div className="userPicker__filters">
                            { filters }
                        </div>
                        <div className="userPicker__list">
                            {
                                usersList && filterUsers().length ?
                                    filterUsers().map(user => renderUser(user))
                                    :
                                    <div className="nothingFound">
                                        { translate('nothing_found') }
                                    </div>
                            }
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
            <div className={'userPicker__list-item selectedUserItem ' + type} key={userID}>
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
                </div>
                {
                    multiple ?
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
        const usersList = JSON.parse(selectedUsers);

        usersList.splice(usersList.indexOf(usersList.find(user => user === userID)), 1);

        setSelectedUsers(JSON.stringify(usersList));
        addUsers(type, usersList);
    }

    function handleHideModal() {
        setSelectedUsers(JSON.stringify(selectedList));
        setInitialSelectedUsers(JSON.stringify(selectedList));
        setShowUserListModal(false);
    }

    function renderUser(user) {
        const usersList = JSON.parse(selectedUsers);

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
                </div>
            </div>
        )
    }

    function chooseUser(userID) {
        const usersList = JSON.parse(selectedUsers);

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
        setSelectedUsers(JSON.stringify(usersList));
    }

    function onAddUsers(e) {
        e.preventDefault();

        addUsers(type, JSON.parse(selectedUsers));
    }

    function filterUsers() {
        return usersList.filter(user => user.role === type && user.status === 'active').filter(user => {
            if ( searchQuery ) {
                if ( user.name.toLowerCase().includes(searchQuery.toLowerCase()) ) {
                    return user;
                }
            }
            else {
                return user;
            }
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
    loading: state.usersReducer.loading
});
export default connect(mapStateToProps)(withFilters(UserPicker, true));
