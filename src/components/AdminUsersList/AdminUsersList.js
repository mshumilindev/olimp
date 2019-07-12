import React from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import {connect} from "react-redux";
import { Preloader } from "../UI/preloader";
import classNames from 'classnames';
import AdminUsersListModal from './AdminUsersListModal';
import {deleteUser} from "../../redux/actions/usersActions";
import './adminUsersList.scss';

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
                title: 'class',
                width: 200
            },
            {
                width: 150
            }
        ];

        this.deleteUser = this.deleteUser.bind(this);
    }

    render() {
        const { loading, filters } = this.props;
        const { translate } = this.context;

        return (
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className={'content_title-icon fa fa-users'} />
                        { translate('users') }
                    </h2>
                    <div className="section__title-actions">
                        <AdminUsersListModal user={this.state.userModel} usersList={this.filterUsersList()} loading={loading} modalTrigger={<a href="/" className="btn btn_primary"><i className={'content_title-icon fa fa-plus'} />{ translate('add_new') }</a>} />
                    </div>
                </div>
                { filters }
                <div className="adminUsersList widget">
                    {
                        this.filterUsersList().length ?
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
                                    { this.filterUsersList().map(user => this._renderUsers(user)) }
                                    </tbody>
                                </table>
                            </div>
                            :
                            loading ?
                                <Preloader/>
                                :
                                <div className="nothingFound">
                                    { translate('nothing_found') }
                                </div>
                    }
                </div>
            </section>
        );
    }

    _renderUsers(user) {
        const { loading } = this.props;
        const { translate } = this.context;

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
                    <span>{ user.name }</span>
                </td>
                <td className="table__body-cell">
                    <span>{ translate(user.role) }</span>
                </td>
                <td className="table__body-cell">
                    <span>{ user.class ? user.class : null }</span>
                </td>
                <td className="table__body-cell table__actions">
                    <AdminUsersListModal user={user} usersList={this.filterUsersList()} loading={loading} modalTrigger={<a href="/" className="table__actions-btn"><i className={'content_title-icon fa fa-user-edit'} />{ translate('edit') }</a>} />
                    {
                        user.id !== JSON.parse(localStorage.getItem('user')).id ?
                            <a href="/" className="table__actions-btn table__actions-btn-error" onClick={e => this.deleteUser(e, user.id)}>
                                <i className={'content_title-icon fa fa-user-times'} />
                                { translate('delete') }
                            </a>
                            :
                            null
                    }
                </td>
            </tr>
        )
    }

    filterUsersList() {
        const { usersList, searchQuery, sortBy, filterBy } = this.props;

        return usersList
            .sort((a, b) => {
                if ( a.name < b.name ) {
                    return -1;
                }
                if ( a.name > b.name ) {
                    return 1;
                }
                return 0;
            })
            .sort((a, b) => {
                const aValue = a[sortBy.value] === 'admin' ? 'a' : a[sortBy.value] === 'teacher' ? 'b' : a[sortBy.value] === 'student' ? 'c' : a[sortBy.value];
                const bValue = b[sortBy.value] === 'admin' ? 'a' : b[sortBy.value] === 'teacher' ? 'b' : b[sortBy.value] === 'student' ? 'c' : b[sortBy.value];

                if ( a[sortBy.value] === undefined ) {
                    return 1;
                }
                if ( b[sortBy.value] === undefined ) {
                    return -1;
                }
                if ( aValue < bValue ) {
                    return -1;
                }
                if ( aValue > bValue ) {
                    return 1;
                }
                return 0;
            })
            .filter(user => {
                const returnValues = [];
                const filterByRole = filterBy.find(filter => filter.id === 'filterByRole');
                const filterByStatus = filterBy.find(filter => filter.id === 'filterByStatus');

                filterByRole.value ?
                    user.role === filterByRole.value ?
                        returnValues.push(true)
                        :
                        returnValues.push(false)
                    :
                    returnValues.push(true);

                filterByStatus.value ?
                    user.status === filterByStatus.value ?
                        returnValues.push(true)
                        :
                        returnValues.push(false)
                    :
                    returnValues.push(true);

                return returnValues.every(value => value);
            })
            .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    deleteUser(e, userID) {
        const { translate } = this.context;
        e.preventDefault();

        if ( window.confirm(translate('sure_to_delete_user')) ) {
            this.props.deleteUser(userID);
        }
    }
}
AdminUsersList.contextType = siteSettingsContext;

const mapStateToProps = state => ({
    usersList: state.usersReducer.usersList,
    loading: state.usersReducer.loading
});
const mapDispatchToProps = dispatch => ({
    deleteUser: (id) => dispatch(deleteUser(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsersList);
