import React, { useContext, useState } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import {connect} from "react-redux";
import { Preloader } from "../UI/preloader";
import classNames from 'classnames';
import AdminUsersListModal from './AdminUsersListModal';
import generator from "generate-password";

const Modal = React.lazy(() => import('../../components/UI/Modal/Modal'));
const Form = React.lazy(() => import('../../components/Form/Form'));

function AdminUsersList({usersList, loading}) {
    const [ showModal, toggleModal ] = useState(false);
    const { translate, getUserFormFields } = useContext(siteSettingsContext);
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
                    <a href="/" className="btn btn_primary" onClick={e => {e.preventDefault(); toggleModal(true)}}>
                        <i className={'content_title-icon fa fa-plus'} />
                        { translate('add_new') }
                    </a>
                    {
                        showModal ?
                            <Modal onHideModal={() => toggleModal(false)}>
                                <Form
                                    loading={loading}
                                    heading={translate('create_user')}
                                    fields={getFormFields()}
                                    // setFieldValue={setFieldValue}
                                    // formAction={createUser}
                                    // formReset={resetUser}
                                />
                            </Modal>
                            :
                            null
                    }
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
            <tr className={classNames('table__body-row', { disabled: user.status !== 'active' })} key={user.name}>
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
                    <span>{ user.name }</span>
                </td>
                <td className="table__body-cell">
                    <span>{ translate(user.role) }</span>
                </td>
                <td className="table__body-cell">
                    <span>{ user.class ? user.class : null }</span>
                </td>
                <td className="table__body-cell table__actions">
                    <AdminUsersListModal user={user} loading={loading} />
                </td>
            </tr>
        )
    }

    function getFormFields() {
        const formFields = getUserFormFields(null, generatePassword);

        formFields.push(
            {
                type: 'submit',
                id: 'save',
                name: translate('create')
            }
        );

        return formFields;
    }

    function generatePassword(fieldID) {
        const newPassword = generator.generate({
            length: 16,
            symbols: true,
            strict: true
        });

        setFieldValue(fieldID, newPassword);
    }

    function setFieldValue(fieldID, value) {
        console.log(fieldID, value);
    }
}
const mapStateToProps = state => ({
    usersList: state.usersReducer.usersList,
    loading: state.usersReducer.loading
});
export default connect(mapStateToProps)(AdminUsersList);
