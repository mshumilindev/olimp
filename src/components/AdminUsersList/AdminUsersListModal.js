import React from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";

const Modal = React.lazy(() => import('../../components/UI/Modal/Modal'));
const Form = React.lazy(() => import('../../components/Form/Form'));

export default class AdminUsersListModal extends React.Component {
    constructor(props, context) {
        super();

        this.state = {
            showModal: false,
            userFields: this.getUserFields(props.user, context.lang)
        };

        this.setFieldValue = this.setFieldValue.bind(this);
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
                            <Form heading={translate('editing_user')} fields={this.state.userFields} setFieldValue={this.setFieldValue}/>
                        </Modal>
                        :
                        null
                }
            </>
        );
    }

    getUserFields(user, lang) {
        return [
            {
                type: 'text',
                id: 'userName_en',
                name: 'userName_en',
                placeholder: 'name',
                hasErrors: false,
                required: true,
                value: user.name[lang]
            }
        ]
    }

    toggleModal() {
        this.setState(state => {
            const newState = {
                showModal: !state.showModal
            };

            if ( !state.showModal ) {
                newState.userFields = this.getUserFields(this.props.user, this.context.lang);
            }

            return {
                ...newState
            }
        });
    }

    setFieldValue(fieldID, value) {
        const { userFields } = this.state;

        userFields.find(field => field.id === fieldID).value = value;

        this.setState(() => {
            return {
                userFields: userFields
            }
        });
    }
}
AdminUsersListModal.contextType = siteSettingsContext;