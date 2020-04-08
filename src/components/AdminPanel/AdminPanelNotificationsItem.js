import React, { useContext, useState, useEffect } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";

const Modal = React.lazy(() => import('../../components/UI/Modal/Modal'));
const Form = React.lazy(() => import('../../components/Form/Form'));
const Confirm = React.lazy(() => import('../UI/Confirm/Confirm'));

function AdminPanelNotificationsItem({loading, notification, updateNotification, onConfirmRemove}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const initialFormFields = [
        {
            type: 'select',
            placeholder: translate('choose_type'),
            id: 'type',
            value: notification.type,
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
                    value: notification.heading.ua,
                    updated: false,
                    placeholder: translate('heading') + ' ' + translate('in_ua')
                },
                {
                    type: 'text',
                    id: 'heading_RU',
                    value: notification.heading.ru,
                    updated: false,
                    placeholder: translate('heading') + ' ' + translate('in_ru')
                },
                {
                    type: 'text',
                    id: 'heading_EN',
                    value: notification.heading.en,
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
                    value: notification.text.ua,
                    updated: false,
                    placeholder: translate('text') + ' ' + translate('in_ua'),
                    required: true,
                    hasErrors: false
                },
                {
                    type: 'textarea',
                    id: 'text_RU',
                    value: notification.text.ru,
                    updated: false,
                    placeholder: translate('text') + ' ' + translate('in_ru')
                },
                {
                    type: 'textarea',
                    id: 'text_EN',
                    value: notification.text.en,
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
                    value: notification.link.text.ua,
                    updated: false,
                    placeholder: translate('link_text') + ' ' + translate('in_ua')
                },
                {
                    type: 'text',
                    id: 'link_RU',
                    value: notification.link.text.ru,
                    updated: false,
                    placeholder: translate('link_text') + ' ' + translate('in_ru')
                },
                {
                    type: 'text',
                    id: 'link_EN',
                    value: notification.link.text.en,
                    updated: false,
                    placeholder: translate('link_text') + ' ' + translate('in_en')
                },
                {
                    type: 'text',
                    id: 'url',
                    value: notification.link.url,
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
    const [ showModal, setShowModal ] = useState(false);
    const [ formFields, setFormFields ] = useState(initialFormFields);
    const [ formUpdated, setFormUpdated ] = useState(false);
    const [ showRemoveConfirm, setShowRemoveConfirm ] = useState(false);

    useEffect(() => {
        // if ( initialNotification ) {
        //     if ( JSON.stringify(notification) !== initialNotification ) {
        //         setFormUpdated(true);
        //     }
        //     else {
        //         setFormUpdated(false);
        //     }
        // }
    }, [notification]);

    return (
        <>
            <div className="notifications__typeHeading">
                {/*{*/}
                {/*    type === 'teachers' ?*/}
                {/*        translate('notifications_for_teachers')*/}
                {/*        :*/}
                {/*        type === 'students' ?*/}
                {/*            translate('notifications_for_students')*/}
                {/*            :*/}
                {/*            null*/}
                {/*}*/}
                {
                    notification.type ?
                        <div className="notifications__typeHeading-remove">
                            <a href="/" className="notifications__typeHeading-remove-btn" onClick={(e) => {e.preventDefault(); return setShowRemoveConfirm(true)}}>
                                <i className="content_title-icon fa fa-trash-alt" />
                                { translate('delete') }
                            </a>
                        </div>
                        :
                        null
                }
            </div>
            <div className="notifications__item">
                <div className="notifications__item-body">
                    {
                        notification.type ?
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
                            :
                            <div className="nothingFound">
                                { translate('no_notifications') }
                            </div>
                    }
                </div>
            </div>
            {
                showModal ?
                    <Modal onHideModal={handleResetNotification}>
                        <Form fields={formFields} heading={notification.type ? translate('edit_notification') : translate('add_notification')} setFieldValue={handleSetFieldValue} formAction={handleUpdateNotification} loading={loading} formUpdated={formUpdated} />
                    </Modal>
                    :
                    null
            }
            {
                showRemoveConfirm ?
                    <Confirm message={translate('sure_to_remove_notification')} confirmAction={handleConfirmRemove} cancelAction={() => setShowRemoveConfirm(false)}/>
                    :
                    null
            }
        </>
    );

    function handleSetFieldValue(fieldID, value) {
        const newFields = formFields;

        if ( fieldID.includes('heading') ) {
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

    function handleConfirmRemove() {
        setShowRemoveConfirm(false);
        // onConfirmRemove(type);
    }

    function handleUpdateNotification() {
        setShowModal(false);
        // updateNotification(type);
    }

    function handleResetNotification() {
        setShowModal(false);
        setFormFields(initialFormFields);
        setFormUpdated(false);
    }
}
export default AdminPanelNotificationsItem;
