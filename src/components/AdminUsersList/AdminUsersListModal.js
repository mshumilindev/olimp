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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ( prevProps.user !== this.props.user ) {
            this.setState(() => {
                return {
                    userFields: this.getUserFields(this.props.user, this.context),
                    showModal: false
                }
            });
        }
    }

    render() {
        const { translate } = this.context;

        return (
            <>
                <a href="/" className="table__actions-btn" onClick={e => { e.preventDefault(); this.toggleModal() } }>
                    <i className={'content_title-icon fa fa-user-edit'} />
                    { translate('edit') }
                </a>
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
                        name: translate('update')
                    }
                ]
            }
        );

        return formFields;
    }

    toggleModal() {
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

    setFieldValue(fieldID, value) {
        const { userFields } = this.state;
        let field = userFields.find(field => field.id === fieldID);

        if ( !field ) {
            field = userFields.find(field => field.type === 'block').children.find(child => child.id === fieldID);
        }

        field.value = value;
        field.updated = true;

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

        const updatedFields = this.getUpdatedFields();

        updateUser(user.id, updatedFields);
    }

    getUpdatedFields() {
        const { userFields } = this.state;
        const { user } = this.props;

        const updatedFields = {};

        userFields.map(field => {
            if ( field.children ) {
                const newValue = {
                    [field.id]: {
                        ...user[field.id]
                    }
                };
                field.children.map(child => {
                    if ( child.updated ) {
                        newValue[field.id][child.id] = child.value;
                        Object.assign(updatedFields, newValue);
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

        delete updatedFields.id;

        return updatedFields;
    }
}
AdminUsersListModal.contextType = siteSettingsContext;

const mapDispatchToProps = dispatch => ({
    updateUser: (id, data) => dispatch(updateUser(id, data))
});

export default connect(null, mapDispatchToProps)(AdminUsersListModal);
