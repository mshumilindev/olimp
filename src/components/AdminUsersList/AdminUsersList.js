import React, { useContext } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import {connect} from "react-redux";
import { Preloader } from "../UI/preloader";
import classNames from 'classnames';
import AdminUsersListModal from './AdminUsersListModal';

function AdminUsersList({usersList}) {
    const { translate, lang } = useContext(siteSettingsContext);
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
            title: 'class',
            width: 200
        },
        {
            width: 150
        }
    ];

    return (
        <section className="section">
            <div className="section__title-holder">
                <h2 className="section__title">
                    <i className={'content_title-icon fa fa-users'} />
                    { translate('users') }
                </h2>
                <div className="section__title-actions">
                    <a href="/" className="btn btn_primary">
                        <i className={'content_title-icon fa fa-plus'} />
                        { translate('add_new') }
                    </a>
                </div>
            </div>
            {
                usersList.length ?
                    <div className="adminUsersList widget">
                        <div className="table__holder">
                            <table className="adminUsersList__table table">
                                <colgroup>
                                    { cols.map((col, index) => <col width={col.width} key={index}/>) }
                                </colgroup>
                                <thead>
                                    <tr className="table__head-row">
                                        { cols.map((col, index) => <th className="table__head-cell" key={index}>{ translate(col.title) }</th>) }
                                    </tr>
                                </thead>
                                <tbody>
                                    { usersList.map(user => _renderUsers(user)) }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    :
                    <Preloader/>
            }
        </section>
    );

    function _renderUsers(user) {
        return (
            <tr className={classNames('table__body-row', { disabled: user.status !== 'active' })} key={user.name[lang]}>
                <td className="table__body-cell">
                    <div className={'status status__' + user.status} title={translate(user.status)}/>
                </td>
                <td className="table__body-cell">
                    {
                        user.data && user.data.avatar ?
                            <div className="table__img" style={{backgroundImage: 'url(' + user.data.avatar + ')'}}/>
                            :
                            <div className="table__img">
                                <i className={'table__img-icon fa fa-user'} />
                            </div>
                    }
                </td>
                <td className="table__body-cell">
                    <span>{ user.name[lang] }</span>
                </td>
                <td className="table__body-cell">
                    <span>{ translate(user.role) }</span>
                </td>
                <td className="table__body-cell">
                    <span>{ user.data && user.data.class ? user.data.class[lang] : null }</span>
                </td>
                <td className="table__body-cell table__actions">
                    <AdminUsersListModal user={user} />
                </td>
            </tr>
        )
    }
}
const mapStateToProps = state => ({
    usersList: state.usersReducer.usersList,
    loading: state.usersReducer.loading
});
export default connect(mapStateToProps)(AdminUsersList);
