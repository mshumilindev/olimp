import React from 'react';
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

const Confirm = React.lazy(() => import('../../components/UI/Confirm/Confirm'));

class AdminUsersList extends React.Component {
    constructor(props, context) {
        super(props);

        const currentUser = JSON.parse(localStorage.getItem('user'));

        this.state = {
            showModal: false,
            userModel: context.getUserModel(),
            showConfirmRemove: false,
            userToDelete: null
        };
        this.cols = [
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

        if ( currentUser.role === 'admin' ) {
            this.cols.push({
                width: 150
            });
        }

        this.deleteUser = this.deleteUser.bind(this);
        this.hideShowConfirm = this.hideShowConfirm.bind(this);
        this.onConfirmRemove = this.onConfirmRemove.bind(this);
    }

    render() {
        const { loading, filters, pager, list, totalItems } = this.props;
        const { translate } = this.context;
        const currentUser = JSON.parse(localStorage.getItem('user'));

        return (
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className={'content_title-icon fa fa-users'} />
                        { translate('users') }
                    </h2>
                    {
                        currentUser.role === 'admin' ?
                            <div className="section__title-actions">
                                <AdminUsersListModal user={this.state.userModel} usersList={list} loading={loading} modalTrigger={<a href="/" className="btn btn_primary"><i className={'content_title-icon fa fa-plus'} />{ translate('add_new') }</a>} />
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
                                        { this._renderUsers(list.find(user => user.id === currentUser.id), true) }
                                        { list.filter(user => user.id !== currentUser.id && user.status === 'active').map(user => this._renderUsers(user)) }
                                        { list.filter(user => user.status === 'suspended').map(user => this._renderUsers(user)) }
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
                    this.state.showConfirmRemove ?
                        <Confirm message={translate('sure_to_delete_user')} confirmAction={this.onConfirmRemove} cancelAction={this.hideShowConfirm}/>
                        :
                        null
                }
            </section>
        );
    }

    _renderUsers(user, isCurrentUser) {
        const { history } = this.props;

        if ( !user ) {
            return null;
        }
        const { loading, list, classesList, allCoursesList } = this.props;
        const { translate, lang } = this.context;
        const selectedClass = classesList ? classesList.find(item => item.id === user.class) : null;
        const selectedCourses = [];
        const currentUser = JSON.parse(localStorage.getItem('user'));

        if ( allCoursesList ) {
            allCoursesList.forEach(subject => {
                if ( subject.coursesList ) {
                    subject.coursesList.forEach(course => {
                        if ( course.teacher === user.id ) {
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
            <div className={classNames('adminUsersList__user', {nonActive: user.status !== 'active'})} key={user.id}>
                <div className="adminUsersList__user-inner" onClick={() => history.push(user.id !== JSON.parse(localStorage.getItem('user')).id ? '/admin-users/' + user.login : '/admin-profile')}>
                    <div className="adminUsersList__user-status">
                        <div className={'status status__' + user.status} title={translate(user.status)}/>
                    </div>
                    <div className="adminUsersList__user-avatarHolder">
                        <div className="adminUsersList__user-avatar" style={{backgroundImage: 'url(' + user.avatar + ')'}}>
                            {
                                !user.avatar ?
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
                                { user.name }
                            </div>
                            <div className="adminUsersList__user-role">
                                { translate(user.role) }
                            </div>
                            {
                                user.email || user.tel || user.skype ?
                                    <div className="adminUsersList__user-contacts">
                                        {
                                            user.email ?
                                                <div className="adminUsersList__user-contact">
                                                    <i className="far fa-envelope"/>
                                                    <a href={'mailto:' + user.email}>{ user.email }</a>
                                                </div>
                                                :
                                                null
                                        }
                                        {
                                            user.tel ?
                                                <div className="adminUsersList__user-contact">
                                                    <i className="fas fa-mobile-alt"/>
                                                    <a href={'tel:' + user.tel}>{ user.tel }</a>
                                                </div>
                                                :
                                                null
                                        }
                                        {
                                            user.skype ?
                                                <div className="adminUsersList__user-contact">
                                                    <i className="fab fa-skype"/>
                                                    <a href={'skype:' + user.skype}>{ user.skype }</a>
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
                                                    <Link to={'/admin-courses/' + course.link}>{ course.courseName }</Link>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                                :
                                null
                        }
                        {
                            user.class && selectedClass ?
                                <div className="adminUsersList__user-classes">
                                    <div className="adminUsersList__user-classes-item">
                                        <i className="fa fa-graduation-cap" />
                                        <Link to={'/admin-classes/' + selectedClass.id}>{ selectedClass.title[lang] ? selectedClass.title[lang] : selectedClass.title['ua'] }</Link>
                                    </div>
                                </div>
                                :
                                null
                        }
                    </div>
                </div>
                {
                    currentUser.role === 'admin' ?
                        <div className="adminUsersList__user-actions">
                            <AdminUsersListModal
                                user={user}
                                usersList={list}
                                loading={loading}
                                modalTrigger={
                                    <a href="/" className="btn btn_primary round btn__xs">
                                        <i className={'fa fa-user-edit'}/>
                                    </a>
                                } />
                            {
                                user.id !== JSON.parse(localStorage.getItem('user')).id ?
                                    <a href="/" className="btn btn__error round btn__xs" onClick={e => this.deleteUser(e, user.id)}>
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

    deleteUser(e, userID) {
        e.preventDefault();

        this.setState({
            showConfirmRemove: true,
            userToDelete: userID
        });
    }

    onConfirmRemove() {
        this.props.deleteUser(this.state.userToDelete);
        this.setState({
            showConfirmRemove: false,
            userToDelete: null
        });
    }

    hideShowConfirm() {
        this.setState({
            showConfirmRemove: false,
            userToDelete: null
        });
    }
}
AdminUsersList.contextType = siteSettingsContext;

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
