import React from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import {connect} from "react-redux";
import { Preloader } from "../UI/preloader";
import classNames from 'classnames';
import AdminUsersListModal from './AdminUsersListModal';
import {deleteUser} from "../../redux/actions/usersActions";
import './adminUsersList.scss';
import { Link } from 'react-router-dom';
import withPager from "../../utils/withPager";
import {fetchAllCourses} from "../../redux/actions/coursesActions";

class AdminUsersList extends React.Component {
    constructor(props, context) {
        super(props);

        this.state = {
            showModal: false,
            userModel: context.getUserModel()
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
            },
            {
                width: 150
            }
        ];

        this.deleteUser = this.deleteUser.bind(this);
    }

    render() {
        const { loading, filters, pager, list } = this.props;
        const { translate } = this.context;

        return (
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className={'content_title-icon fa fa-users'} />
                        { translate('users') }
                    </h2>
                    <div className="section__title-actions">
                        <AdminUsersListModal user={this.state.userModel} usersList={list} loading={loading} modalTrigger={<a href="/" className="btn btn_primary"><i className={'content_title-icon fa fa-plus'} />{ translate('add_new') }</a>} />
                    </div>
                    {
                        loading ?
                            <Preloader size={60}/>
                            :
                            null
                    }
                </div>
                { filters }
                <div className="adminUsersList widget">
                    {
                        list && list.length ?
                            <>
                                <div className="table__holder">
                                    <table className="adminUsersList__table table">
                                        <colgroup>
                                            { this.cols.map((col, index) => <col width={col.width} key={index}/>) }
                                        </colgroup>
                                        <thead>
                                        <tr className="table__head-row">
                                            { this.cols.map((col, index) => <th className="table__head-cell" key={index}>{ translate(col.title) }</th>) }
                                        </tr>
                                        </thead>
                                        <tbody>
                                            { list.map(user => this._renderUsers(user)) }
                                        </tbody>
                                    </table>
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
            </section>
        );
    }

    _renderUsers(user) {
        const { loading, list, classesList, allCoursesList } = this.props;
        const { translate, lang } = this.context;
        const selectedClass = classesList ? classesList.find(item => item.id === user.class) : null;
        const selectedCourses = [];

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
            <tr className={classNames('table__body-row', { disabled: user.status !== 'active' })} key={user.id}>
                <td className="table__body-cell">
                    <div className={'status status__' + user.status} title={translate(user.status)}/>
                </td>
                <td className="table__body-cell">
                    {
                        user.avatar ?
                            <div className="table__img" style={{backgroundImage: 'url(' + user.avatar + ')'}}/>
                            :
                            <div className="table__img">
                                <i className={'table__img-icon fa fa-user'} />
                            </div>
                    }
                </td>
                <td className="table__body-cell">
                    <span><Link to={user.id !== JSON.parse(localStorage.getItem('user')).id ? '/admin-users/' + user.login : '/admin-profile'}>{ user.name }</Link></span>
                </td>
                <td className="table__body-cell">
                    <span>{ translate(user.role) }</span>
                </td>
                <td className="table__body-cell" style={{lineHeight: '20px'}}>
                    {
                        selectedCourses.length ? selectedCourses.map((course, index) => {
                            return (
                                <span key={course.courseName}>
                                    <Link to={'/admin-courses/' + course.link}>{ course.courseName }</Link>
                                    {
                                        index < selectedCourses.length - 1 ?
                                            <>,</>
                                            :
                                            null
                                    }
                                    <br/>
                                </span>
                            );
                        }) : null
                    }
                </td>
                <td className="table__body-cell">
                    {
                        user.class && selectedClass ?
                            <Link to={'/admin-classes/' + selectedClass.id}>{ selectedClass.title[lang] ? selectedClass.title[lang] : selectedClass.title['ua'] }</Link>
                            :
                            null
                    }
                </td>
                <td className="table__body-cell">
                    <div className="table__actions">
                        <AdminUsersListModal user={user} usersList={list} loading={loading} modalTrigger={<a href="/" className="table__actions-btn"><i className={'content_title-icon fa fa-user-edit'} />{ translate('edit') }</a>} />
                        {
                            user.id !== JSON.parse(localStorage.getItem('user')).id ?
                                <a href="/" className="table__actions-btn table__actions-btn-error" onClick={e => this.deleteUser(e, user.id)}>
                                    <i className={'content_title-icon fa fa-user-times'} />
                                    { translate('delete') }
                                </a>
                                :
                                null
                        }
                    </div>
                </td>
            </tr>
        )
    }

    deleteUser(e, userID) {
        e.preventDefault();

        const { translate } = this.context;

        if ( window.confirm(translate('sure_to_delete_user')) ) {
            this.props.deleteUser(userID);
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(withPager(AdminUsersList));
