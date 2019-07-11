import React from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import generator from 'generate-password';
import { updateUser } from "../../redux/actions/usersActions";
import {connect} from "react-redux";

const Modal = React.lazy(() => import('../../components/UI/Modal/Modal'));
const Form = React.lazy(() => import('../../components/Form/Form'));

class AdminUsersListModal extends React.Component {
    constructor(props, context) {
        super();

        this.state = {
            showModal: false,
            userFields: this.getUserFields(props.user, context)
        };

        this.getUserFields = this.getUserFields.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.setFieldValue = this.setFieldValue.bind(this);
        this.generatePassword = this.generatePassword.bind(this);
        this.resetUser = this.resetUser.bind(this);
    }

    render() {
        const { translate } = this.context;

        return (
            <>
                <span onClick={e => { e.preventDefault(); this.toggleModal() } }>
                    { this.props.modalTrigger }
                </span>
                {
                    this.state.showModal ?
                        <Modal onHideModal={() => this.toggleModal()}>
                            <Form loading={this.props.loading} heading={translate('editing_user')} fields={this.state.userFields} setFieldValue={this.setFieldValue} formAction={this.updateUser} formReset={this.resetUser}/>
                        </Modal>
                        :
                        null
                }
            </>
        );
    }

    getUserFields(user, context) {
        const { translate, getUserFormFields } = context;

        const formFields = getUserFormFields(user, this.generatePassword);

        formFields.push(
            {
                type: 'actions',
                id: 'actions',
                children: [
                    {
                        type: 'reset',
                        id: 'reset',
                        name: translate('reset')
                    },
                    {
                        type: 'submit',
                        id: 'save',
                        name: user.id ? translate('update') : translate('create')
                    }
                ]
            }
        );

        return formFields;
    }

    toggleModal() {
        if ( this.state.showModal && this.props.onToggleModal ) {
            this.props.onToggleModal();
        }
        this.setState(state => {
            const newState = {
                showModal: !state.showModal
            };

            if ( !state.showModal ) {
                newState.userFields = this.getUserFields(this.props.user, this.context);
            }

            return {
                ...newState
            }
        });
    }

    resetUser() {
        this.setState(() => {
            const newState = {};

            newState.userFields = this.getUserFields(this.props.user, this.context);

            return {
                ...newState
            }
        });
    }

    setFieldValue(fieldID, value, placeholder) {
        const { userFields } = this.state;
        const { user, usersList } = this.props;
        const { translate } = this.context;

        let field = userFields.find(field => field.id === fieldID);

        if ( !field ) {
            field = userFields.find(field => field.type === 'block' || field.type === 'cols').children.find(child => child.id === fieldID);
        }

        if ( fieldID === 'login' ) {
            if ( usersList.some(item => item.id !== user.id && item.login === value) ) {
                field.hasErrors = true;
                field.errorMessage = translate('login_already_exists');
            }
            else {
                field.hasErrors = false;
                field.errorMessage = null;
            }
        }

        field.value = value;
        field.updated = true;

        if ( placeholder ) {
            field.placeholder = placeholder;
        }

        this.setState(() => {
            return {
                userFields: userFields
            }
        });
    }

    generatePassword(fieldID) {
        const newPassword = generator.generate({
            length: 16,
            symbols: true,
            strict: true
        });

        this.setFieldValue(fieldID, newPassword);
    }

    updateUser() {
        const { user, updateUser } = this.props;
        let userID = user.id;

        const updatedFields = this.getUpdatedFields();

        if ( user.id ) {
            delete updatedFields.id;
        }
        else {
            userID = this.generateID();
        }

        updateUser(userID, updatedFields);
    }

    generateID() {
        return generator.generate({
            length: 16
        });
    }

    getUpdatedFields() {
        const { userFields } = this.state;
        const { user } = this.props;

        const updatedFields = {};

        userFields.map(field => {
            if ( field.children ) {
                field.children.map(child => {
                    if ( child.updated ) {
                        Object.assign(updatedFields, {[child.id]: child.value});
                    }
                });
            }
            else {
                if ( field.updated ) {
                    Object.assign(updatedFields, {[field.id]: field.value});
                }
            }
        });
        Object.assign(updatedFields, {
            ...user,
            ...updatedFields
        });

        delete updatedFields.isNew;

        return updatedFields;
    }
}
AdminUsersListModal.contextType = siteSettingsContext;

const mapDispatchToProps = dispatch => ({
    updateUser: (id, data) => dispatch(updateUser(id, data))
});

export default connect(null, mapDispatchToProps)(AdminUsersListModal);
