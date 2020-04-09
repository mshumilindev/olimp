import React, {useContext, useEffect, useState} from 'react';
import {connect} from "react-redux";
import {Preloader} from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import Modal from "../UI/Modal/Modal";
import Form from "../Form/Form";
import Confirm from "../UI/Confirm/Confirm";
import {generate} from "generate-password";
import { updateNotification, removeNotification } from '../../redux/actions/notificationsActions';

function AdminPanelNotifications({loading, notificationsList, updateNotification, removeNotification}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ showModal, setShowModal ] = useState(false);
    const [ formUpdated, setFormUpdated ] = useState(false);
    const initialFormFields = [
        {
            type: 'block',
            heading: translate('target_users'),
            id: 'users',
            children: [
                {
                    type: 'userPicker',
                    id: 'userPicker',
                    value: [],
                    required: true,
                    hasErrors: false,
                    multiple: true,
                    updated: false,
                    excludeRole: 'admin'
                }
            ]
        },
        {
            type: 'select',
            placeholder: translate('choose_type'),
            id: 'type',
            value: '',
            required: true,
            hasErrors: false,
            updated: false,
            options: [
                {
                    id: 'message',
                    icon: 'fas fa-comment',
                    title: translate('message')
                },
                {
                    id: 'warning',
                    icon: 'fa fa-exclamation-triangle',
                    title: translate('warning')
                },
                {
                    id: 'error',
                    icon: 'fa fa-exclamation',
                    title: translate('error')
                }
            ]
        },
        {
            type: 'block',
            heading: translate('heading'),
            id: 'heading',
            children: [
                {
                    type: 'text',
                    id: 'heading_UA',
                    value: '',
                    updated: false,
                    placeholder: translate('heading') + ' ' + translate('in_ua')
                },
                {
                    type: 'text',
                    id: 'heading_RU',
                    value: '',
                    updated: false,
                    placeholder: translate('heading') + ' ' + translate('in_ru')
                },
                {
                    type: 'text',
                    id: 'heading_EN',
                    value: '',
                    updated: false,
                    placeholder: translate('heading') + ' ' + translate('in_en')
                }
            ]
        },
        {
            type: 'block',
            heading: translate('text'),
            id: 'text',
            children: [
                {
                    type: 'textarea',
                    id: 'text_UA',
                    value: '',
                    updated: false,
                    placeholder: translate('text') + ' ' + translate('in_ua'),
                    required: true,
                    hasErrors: false
                },
                {
                    type: 'textarea',
                    id: 'text_RU',
                    value: '',
                    updated: false,
                    placeholder: translate('text') + ' ' + translate('in_ru')
                },
                {
                    type: 'textarea',
                    id: 'text_EN',
                    value: '',
                    updated: false,
                    placeholder: translate('text') + ' ' + translate('in_en')
                }
            ]
        },
        {
            type: 'block',
            heading: translate('link'),
            id: 'link',
            children: [
                {
                    type: 'text',
                    id: 'link_UA',
                    value: '',
                    updated: false,
                    placeholder: translate('link_text') + ' ' + translate('in_ua')
                },
                {
                    type: 'text',
                    id: 'link_RU',
                    value: '',
                    updated: false,
                    placeholder: translate('link_text') + ' ' + translate('in_ru')
                },
                {
                    type: 'text',
                    id: 'link_EN',
                    value: '',
                    updated: false,
                    placeholder: translate('link_text') + ' ' + translate('in_en')
                },
                {
                    type: 'text',
                    id: 'url',
                    value: '',
                    updated: false,
                    placeholder: translate('link_url')
                }
            ]
        },
        {
            type: 'submit',
            id: 'submit',
            name: translate('save')
        }
    ];
    const [ formFields, setFormFields ] = useState(Object.assign([], initialFormFields));
    const [ notificationToEdit, setNotificationToEdit ] = useState(null);
    const [ showRemoveConfirm, setShowRemoveConfirm ] = useState(false);
    const [ notificationToRemove, setNotificationToRemove ] = useState(null);

    useEffect(() => {
        if ( notificationToEdit ) {
            const currentNotification = notificationsList.find(notification => notification.id === notificationToEdit);
            const newFields = formFields;

            newFields.find(block => block.id === 'users').children.find(field => field.id === 'userPicker').value = currentNotification.targetUsers;
            newFields.find(field => field.id === 'type').value = currentNotification.type;
            newFields.find(block => block.id === 'heading').children.find(field => field.id === 'heading_UA').value = currentNotification.heading.ua;
            newFields.find(block => block.id === 'heading').children.find(field => field.id === 'heading_RU').value = currentNotification.heading.ru;
            newFields.find(block => block.id === 'heading').children.find(field => field.id === 'heading_EN').value = currentNotification.heading.en;
            newFields.find(block => block.id === 'text').children.find(field => field.id === 'text_UA').value = currentNotification.text.ua;
            newFields.find(block => block.id === 'text').children.find(field => field.id === 'text_RU').value = currentNotification.text.ru;
            newFields.find(block => block.id === 'text').children.find(field => field.id === 'text_EN').value = currentNotification.text.en;
            newFields.find(block => block.id === 'link').children.find(field => field.id === 'link_UA').value = currentNotification.link.text.ua;
            newFields.find(block => block.id === 'link').children.find(field => field.id === 'link_RU').value = currentNotification.link.text.ru;
            newFields.find(block => block.id === 'link').children.find(field => field.id === 'link_EN').value = currentNotification.link.text.en;
            newFields.find(block => block.id === 'link').children.find(field => field.id === 'url').value = currentNotification.link.url;

            setFormFields(newFields);
            setShowModal(true);
        }
    }, [notificationToEdit]);

    useEffect(() => {
        if ( notificationToRemove ) {
            setShowRemoveConfirm(true);
        }
        else {
            setShowRemoveConfirm(false);
        }
    }, [notificationToRemove]);

    return (
        <>
            <div className="widget">
                <div className="widget__title">
                    <i className="content_title-icon fa fa-bell" />
                    { translate('notifications') }
                </div>
                {
                    loading || !notificationsList ?
                        <Preloader/>
                        :
                        notificationsList.length ?
                            notificationsList.map(notification => _renderNotification(notification))
                            :
                            <div className="nothingFound">
                                { translate('no_notifications') }
                            </div>
                }
                {
                    !loading && notificationsList ?
                        <div className="notifications__add">
                            <span className="notifications__add-btn" onClick={() => setShowModal(true)}>
                                {
                                    <>
                                        <i className="content_title-icon fa fa-plus" />
                                        { translate('add') }
                                    </>
                                }
                            </span>
                        </div>
                        :
                        null
                }
            </div>
            {
                showModal ?
                    <Modal onHideModal={resetForm}>
                        <Form fields={formFields} heading={notificationToEdit ? translate('edit_notification') : translate('add_notification')} setFieldValue={handleSetFieldValue} formAction={handleUpdateNotification} loading={loading} formUpdated={formUpdated} />
                    </Modal>
                    :
                    null
            }
            {
                showRemoveConfirm ?
                    <Confirm message={translate('sure_to_remove_notification')} confirmAction={handleConfirmRemove} cancelAction={() => setNotificationToRemove(null)}/>
                    :
                    null
            }
        </>
    );

    function _renderNotification(notification) {
        return (
            <div className="notifications__item" key={notification.id}>
                <div className="notification__actions">
                    <div className="notification__actions-edit" onClick={() => setNotificationToEdit(notification.id)}>
                        <i className="content_title-icon fa fa-pencil-alt" />
                        { translate('edit') }
                    </div>
                    <div className="notification__actions-remove" onClick={() => setNotificationToRemove(notification.id)}>
                        <i className="content_title-icon fa fa-trash-alt" />
                        { translate('delete') }
                    </div>
                </div>
                <div className="notifications__item-body">
                    <div className={'notification ' + notification.type}>
                        <div className="notification__icon">
                            {
                                notification.type === 'message' ?
                                    <i className="fas fa-comment" />
                                    :
                                    notification.type === 'warning' ?
                                        <i className="fa fa-exclamation-triangle" />
                                        :
                                        notification.type === 'error' ?
                                            <i className="fa fa-exclamation" />
                                            :
                                            null
                            }
                        </div>
                        <div className="notification__content">
                            {
                                notification.heading[lang] || notification.heading['ua'] ?
                                    <div className="notification__heading">
                                        { notification.heading[lang] ? notification.heading[lang] : notification.heading['ua'] }
                                    </div>
                                    :
                                    null
                            }
                            {
                                notification.text[lang] || notification.text['ua'] ?
                                    <div className="notification__text">
                                        { notification.text[lang] ? notification.text[lang] : notification.text['ua'] }
                                    </div>
                                    :
                                    null
                            }
                            {
                                notification.link.url && (notification.link.text[lang] || notification.link.text['ua']) ?
                                    <div className="notification__link">
                                        <a href={notification.link.url} target="_blank" rel="noopener noreferrer" className="btn">
                                            { notification.link.text[lang] ? notification.link.text[lang] : notification.link.text['ua'] }
                                        </a>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    function resetForm() {
        setShowModal(false);
        setFormUpdated(false);
        setFormFields(Object.assign([], initialFormFields));
        setNotificationToEdit(null);
    }

    function handleSetFieldValue(fieldID, value) {
        const newFields = formFields;

        if ( fieldID === 'userPicker' ) {
            newFields.find(block => block.id === 'users').children.find(field => field.id === fieldID).value = value;
            if ( value ) {
                newFields.find(block => block.id === 'users').children.find(field => field.id === fieldID).updated = true;
            }
        }
        else if ( fieldID.includes('heading') ) {
            newFields.find(block => block.id === 'heading').children.find(field => field.id === fieldID).value = value;
            if ( value ) {
                newFields.find(block => block.id === 'heading').children.find(field => field.id === fieldID).updated = true;
            }
        }
        else if ( fieldID.includes('text') ) {
            newFields.find(block => block.id === 'text').children.find(field => field.id === fieldID).value = value;
            if ( value ) {
                newFields.find(block => block.id === 'text').children.find(field => field.id === fieldID).updated = true;
            }
        }
        else if ( fieldID.includes('link') || fieldID === 'url' ) {
            newFields.find(block => block.id === 'link').children.find(field => field.id === fieldID).value = value;
            if ( value ) {
                newFields.find(block => block.id === 'link').children.find(field => field.id === fieldID).updated = true;
            }
        }
        else {
            formFields.find(field => field.id === fieldID).value = value;
            if ( value ) {
                formFields.find(field => field.id === fieldID).updated = true;
            }
        }

        if ( value && !formUpdated ) {
            setFormUpdated(true);
        }

        setFormFields(Object.assign([], newFields));
    }

    function handleUpdateNotification() {
        const newNotification = {
            heading: {},
            text: {},
            link: {
                text: {}
            }
        };

        if ( !notificationToEdit ) {
            newNotification.id = generate({
                length: 20,
                numbers: true
            });
        }
        else {
            newNotification.id = notificationToEdit;
        }

        newNotification.targetUsers = formFields.find(block => block.id === 'users').children.find(field => field.id === 'userPicker').value;
        newNotification.type = formFields.find(field => field.id === 'type').value;
        newNotification.heading.ua = formFields.find(block => block.id === 'heading').children.find(field => field.id === 'heading_UA').value;
        newNotification.heading.en = formFields.find(block => block.id === 'heading').children.find(field => field.id === 'heading_EN').value;
        newNotification.heading.ru = formFields.find(block => block.id === 'heading').children.find(field => field.id === 'heading_RU').value;
        newNotification.text.ua = formFields.find(block => block.id === 'text').children.find(field => field.id === 'text_UA').value;
        newNotification.text.en = formFields.find(block => block.id === 'text').children.find(field => field.id === 'text_EN').value;
        newNotification.text.ru = formFields.find(block => block.id === 'text').children.find(field => field.id === 'text_RU').value;
        newNotification.link.text.ua = formFields.find(block => block.id === 'link').children.find(field => field.id === 'link_UA').value;
        newNotification.link.text.ru = formFields.find(block => block.id === 'link').children.find(field => field.id === 'link_RU').value;
        newNotification.link.text.en = formFields.find(block => block.id === 'link').children.find(field => field.id === 'link_EN').value;
        newNotification.link.url = formFields.find(block => block.id === 'link').children.find(field => field.id === 'url').value;

        updateNotification(newNotification);
        setShowModal(false);
        setFormFields(Object.assign([], initialFormFields));
        setNotificationToEdit(null);
    }

    function handleConfirmRemove() {
        removeNotification(notificationToRemove);
        setNotificationToRemove(null);
    }
}
const mapStateToProps = state => ({
    notificationsList: state.notificationsReducer.notificationsList,
    loading: state.usersReducer.loading
});

const mapDispatchToProps = dispatch => ({
    updateNotification: (notification) => dispatch(updateNotification(notification)),
    removeNotification: (notificationID) => dispatch(removeNotification(notificationID))
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanelNotifications);
