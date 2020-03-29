import React, {useContext, useState} from 'react';
import SiteSettingsContext from "../../context/siteSettingsContext";
import { connect } from 'react-redux';
import ChatList from "../../components/ChatList/ChatList";
import userContext from "../../context/userContext";
import './adminChats.scss';
import Modal from "../../components/UI/Modal/Modal";
import Form from "../../components/Form/Form";
import { generate } from "generate-password";
import { updateEvent } from '../../redux/actions/eventsActions';
import moment from "moment";
import {orderBy} from "natural-orderby";

function AdminChats({loading, events, usersList, updateEvent}) {
    const { translate } = useContext(SiteSettingsContext);
    const { user } = useContext(userContext);
    const initialFormFields = [
        {
            type: 'block',
            id: 'info',
            heading: translate('info'),
            children: [
                {
                    type: 'text',
                    placeholder: translate('videochat_name'),
                    value: '',
                    id: 'name',
                    required: true
                },
                // {
                //     type: 'checkbox',
                //     label: translate('recurring'),
                //     value: true,
                //     checked: false,
                //     id: 'recurring'
                // },
                {
                    type: 'datepicker',
                    value: moment().unix(),
                    id: 'datepicker',
                    time: true,
                    required: true
                }
            ]
        },
        {
            type: 'block',
            heading: translate('organizer'),
            id: 'block_organizer',
            children: [
                {
                    type: 'userPicker',
                    value: user.id,
                    id: 'organizer',
                    placeholder: translate('organizator'),
                    noneditable: true,
                    required: true
                }
            ]
        },
        {
            type: 'block',
            heading: translate('participants'),
            id: 'block_participants',
            children: [
                {
                    type: 'userPicker',
                    value: [],
                    id: 'participant',
                    placeholder: translate('participant'),
                    multiple: true,
                    required: true,
                    exclude: [user.id]
                }
            ]
        },
        {
            id: 'submit',
            type: 'submit',
            name: translate('save')
        }
    ];
    const [ showEditModal, setShowEditModal ] = useState(null);
    const [ formFields, setFormFields ] = useState(Object.assign([], initialFormFields));

    return (
        <section className="section">
            <div className="section__title-holder">
                <h2 className="section__title">
                    <i className="content_title-icon fa fa-video" />
                    { translate('videochats') }
                </h2>
                <div className="section__title-actions">
                    <span className="btn btn_primary" onClick={() => setShowEditModal({})}>
                        <i className="content_title-icon fa fa-plus"/>
                        { translate('create_videochat') }
                    </span>
                </div>
            </div>
            <ChatList events={filteredEvents()} usersList={usersList} loading={loading} mapEventToFormFields={mapEventToFormFields} />
            {
                showEditModal ?
                    <Modal
                        onHideModal={handleHideModal}
                        children={
                            <Form setFieldValue={setFieldValue} fields={formFields} formAction={onUpdateEvent} heading={showEditModal.id ? translate('edit_videochat') : translate('create_videochat')} />
                        }
                    />
                    :
                    null
            }
        </section>
    );

    function mapEventToFormFields(event) {
        const newFormFields = Object.assign([], initialFormFields);

        newFormFields.find(item => item.id === 'block_organizer').children[0].value = event.organizer;
        newFormFields.find(item => item.id === 'block_participants').children[0].value = event.participants;
        newFormFields.find(item => item.id === 'info').children.find(item => item.id === 'name').value = event.name;
        newFormFields.find(item => item.id === 'info').children.find(item => item.id === 'datepicker').value = event.datetime;
        setFormFields(Object.assign([], newFormFields));
        setShowEditModal(event);
    }

    function handleHideModal() {
        setShowEditModal(null);
        setFormFields(Object.assign([], initialFormFields));
    }

    function setFieldValue(fieldID, value) {
        const newFields = formFields;

        if ( fieldID === 'participant' ) {
            newFields.find(item => item.id === 'block_participants').children[0].value = value;
        }
        if ( fieldID === 'name' || fieldID === 'recurring' || fieldID === 'datepicker' ) {
            newFields.find(item => item.id === 'info').children.find(item => item.id === fieldID).value = value;
        }

        setFormFields(Object.assign([], newFields));
    }

    function onUpdateEvent() {
        let newEvent = {};
        if ( !showEditModal.id ) {
            newEvent.id = generate({
                length: 20,
                numbers: true
            });
        }
        else {
            newEvent.id = showEditModal.id;
        }
        newEvent.organizer = formFields.find(item => item.id === 'block_organizer').children[0].value;
        newEvent.participants = formFields.find(item => item.id === 'block_participants').children[0].value;
        newEvent.name = formFields.find(item => item.id === 'info').children.find(item => item.id === 'name').value;
        newEvent.datetime = formFields.find(item => item.id === 'info').children.find(item => item.id === 'datepicker').value;

        updateEvent(newEvent.id, newEvent);
        setFormFields(Object.assign([], initialFormFields));
        setShowEditModal(false);
    }

    function filteredEvents() {
        if ( user.role === 'admin' ) {
            return orderBy(events, v => v.datetime);
        }
        else {
            return orderBy(events.filter(event => user.role === 'admin' || event.organizer === user.id || event.participants.indexOf(user.id) !== -1));
        }
    }
}

const mapStateToProps = state => {
    return {
        loading: state.eventsReducer.loading,
        events: state.eventsReducer.events,
        usersList: state.usersReducer.usersList
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateEvent: (eventID, newEvent) => dispatch(updateEvent(eventID, newEvent))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminChats);