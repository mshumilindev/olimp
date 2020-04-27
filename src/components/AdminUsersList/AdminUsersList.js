import React, {useContext, useState} from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import {connect} from "react-redux";
import { Preloader } from "../UI/preloader";
import classNames from 'classnames';
import AdminUsersListModal from './AdminUsersListModal';
import {deleteUser} from "../../redux/actions/usersActions";
import './adminUsersList.scss';
import { Link, withRouter } from 'react-router-dom';
import withPager from "../../utils/withPager";
import {fetchAllCourses} from "../../redux/actions/coursesActions";
import {orderBy} from "natural-orderby";
import userContext from "../../context/userContext";

const Confirm = React.lazy(() => import('../../components/UI/Confirm/Confirm'));

function AdminUsersList({history, deleteUser, loading, filters, pager, list, totalItems, classesList, allCoursesList}) {
    const { translate, lang, getUserModel } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);
    const [ showConfirmRemove, setShowConfirmRemove ] = useState(false);
    const [ userToDelete, setUserToDelete ] = useState(null);
    const userModel = getUserModel();

    const cols = [
        {
            width: 20
        },
        {
            width: 50
        },
        {
            title: 'name',
            width: 200
        },
        {
            title: 'role',
            width: 200
        },
        {
            title: 'courses',
            width: 200
        },
        {
            title: 'class',
            width: 100
        }
    ];

    if ( user.role === 'admin' ) {
        cols.push({
            width: 150
        });
    }

    return (
        <section className="section">
            <div className="section__title-holder">
                <h2 className="section__title">
                    <i className={'content_title-icon fa fa-users'} />
                    { translate('users') }
                </h2>
                {
                    user.role === 'admin' ?
                        <div className="section__title-actions">
                            <AdminUsersListModal user={userModel} usersList={list} loading={loading} modalTrigger={<a href="/" className="btn btn_primary"><i className={'content_title-icon fa fa-plus'} />{ translate('add_new') }</a>} />
                        </div>
                        :
                        null
                }
                {
                    loading ?
                        <Preloader size={60}/>
                        :
                        null
                }
            </div>
            { filters }
            <div className="adminUsersList grid">
                <div className="grid_col col-12">
                    { totalItems }
                    {
                        list && list.length ?
                            <>
                                <div className="adminUsersList__list">
                                    { list.filter(userItem => userItem.status === 'active').map(userItem => _renderUsers(userItem)) }
                                    { list.filter(userItem => userItem.status === 'suspended').map(userItem => _renderUsers(userItem)) }
                                </div>
                                { pager }
                            </>
                            :
                            loading ?
                                <Preloader/>
                                :
                                <div className="nothingFound">
                                    { translate('nothing_found') }
                                </div>
                    }
                    {
                        list && list.length && loading ?
                            <Preloader/>
                            :
                            null
                    }
                </div>
            </div>
            {
                showConfirmRemove ?
                    <Confirm message={translate('sure_to_delete_user')} confirmAction={onConfirmRemove} cancelAction={hideShowConfirm}/>
                    :
                    null
            }
        </section>
    );

    function _renderUsers(userItem) {
        if ( !userItem ) {
            return null;
        }
        const selectedClass = classesList ? classesList.find(item => item.id === userItem.class) : null;
        const selectedCourses = [];

        if ( allCoursesList ) {
            allCoursesList.forEach(subject => {
                if ( subject.coursesList ) {
                    subject.coursesList.forEach(course => {
                        if ( course.teacher === userItem.id ) {
                            selectedCourses.push({
                                link: subject.id + '/' + course.id,
                                courseName: course.name[lang] ? course.name[lang] : course.name['ua']
                            })
                        }
                    });
                }
            });
        }

        return (
            <div className={classNames('adminUsersList__user', {nonActive: userItem.status !== 'active'})} key={userItem.id}>
                <div className="adminUsersList__user-inner" onClick={() => history.push(userItem.id !== user.id ? '/admin-users/' + userItem.login : '/admin-profile')}>
                    <div className="adminUsersList__user-status">
                        <div className={'status status__' + userItem.status} title={translate(userItem.status)}/>
                    </div>
                    <div className="adminUsersList__user-avatarHolder">
                        <div className="adminUsersList__user-avatar" style={{backgroundImage: 'url(' + userItem.avatar + ')'}}>
                            {
                                !userItem.avatar ?
                                    <div className="adminUsersList__user-avatar-placeholder">
                                        <i className={'fa fa-user'}/>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                    </div>
                    <div className="adminUsersList__user-info">
                        <div className="adminUsersList__user-info-personal">
                            <div className="adminUsersList__user-name">
                                { userItem.name }
                            </div>
                            <div className="adminUsersList__user-role">
                                { translate(userItem.role) }
                            </div>
                            {
                                userItem.email || userItem.tel || userItem.skype ?
                                    <div className="adminUsersList__user-contacts">
                                        {
                                            userItem.email ?
                                                <div className="adminUsersList__user-contact">
                                                    <i className="far fa-envelope"/>
                                                    <a href={'mailto:' + userItem.email} onClick={e => e.stopPropagation()}>{ userItem.email }</a>
                                                </div>
                                                :
                                                null
                                        }
                                        {
                                            userItem.tel ?
                                                <div className="adminUsersList__user-contact">
                                                    <i className="fas fa-mobile-alt"/>
                                                    <a href={'tel:' + userItem.tel} onClick={e => e.stopPropagation()}>{ userItem.tel }</a>
                                                </div>
                                                :
                                                null
                                        }
                                        {
                                            userItem.skype ?
                                                <div className="adminUsersList__user-contact">
                                                    <i className="fab fa-skype"/>
                                                    <a href={'skype:' + userItem.skype} onClick={e => e.stopPropagation()}>{ userItem.skype }</a>
                                                </div>
                                                :
                                                null
                                        }
                                    </div>
                                    :
                                    null
                            }
                        </div>
                        {
                            selectedCourses.length ?
                                <div className="adminUsersList__user-courses">
                                    {
                                        orderBy(selectedCourses, v => v.courseName).map(course => {
                                            return (
                                                <div className="adminUsersList__user-courses-item" key={course.courseName}>
                                                    <i className="fa fa-book" />
                                                    {
                                                        user.role === 'admin' ?
                                                            <Link to={'/admin-courses/' + course.link} onClick={e => e.stopPropagation()}>{ course.courseName }</Link>
                                                            :
                                                            <span>{ course.courseName }</span>
                                                    }
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                                :
                                null
                        }
                        {
                            userItem.class && selectedClass ?
                                <div className="adminUsersList__user-classes">
                                    <div className="adminUsersList__user-classes-item">
                                        <i className="fa fa-graduation-cap" />
                                        <Link to={'/admin-classes/' + selectedClass.id} onClick={e => e.stopPropagation()}>{ selectedClass.title[lang] ? selectedClass.title[lang] : selectedClass.title['ua'] }</Link>
                                    </div>
                                </div>
                                :
                                null
                        }
                    </div>
                </div>
                {
                    user.role === 'admin' ?
                        <div className="adminUsersList__user-actions">
                            <AdminUsersListModal
                                user={userItem}
                                usersList={list}
                                loading={loading}
                                modalTrigger={
                                    <a href="/" className="btn btn_primary round btn__xs">
                                        <i className={'fa fa-user-edit'}/>
                                    </a>
                                } />
                            {
                                userItem.id !== user.id ?
                                    <a href="/" className="btn btn__error round btn__xs" onClick={e => handleDeleteUser(e, userItem.id)}>
                                        <i className={'fa fa-user-times'} />
                                    </a>
                                    :
                                    null
                            }
                        </div>
                        :
                        null
                }
            </div>
        );
    }

    function handleDeleteUser(e, userID) {
        e.preventDefault();

        setShowConfirmRemove(true);
        setUserToDelete(userID);
    }

    function onConfirmRemove() {
        deleteUser(userToDelete);
        setShowConfirmRemove(false);
        setUserToDelete(null);
    }

    function hideShowConfirm() {
        setShowConfirmRemove(false);
        setUserToDelete(null);
    }
}

const mapStateToProps = state => ({
    classesList: state.classesReducer.classesList,
    allCoursesList: state.coursesReducer.coursesList,
    loading: state.classesReducer.loading
});
const mapDispatchToProps = dispatch => ({
    deleteUser: (id) => dispatch(deleteUser(id)),
    fetchAllCourses: dispatch(fetchAllCourses())
});

export default connect(mapStateToProps, mapDispatchToProps)(withPager(withRouter(AdminUsersList)));
