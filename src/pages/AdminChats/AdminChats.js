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
import {Preloader} from "../../components/UI/preloader";

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
            type: 'block',
            heading: translate('lesson'),
            id: 'lesson',
            children: [
                {
                    type: 'lessonPicker',
                    value: {},
                    id: 'lessonPicker'
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
            {
                events.all || events.organizer || events.participant ?
                    user.role === 'admin' ?
                        <ChatList events={events.all} usersList={usersList} loading={loading} mapEventToFormFields={mapEventToFormFields} heading={translate('videochats')} />
                        :
                        <div className="grid">
                            {
                                events.organizer ?
                                    <div className="grid_col col-12 desktop-col-6">
                                        <ChatList events={events.organizer} usersList={usersList} loading={loading} mapEventToFormFields={mapEventToFormFields} heading={translate('organizer')} />
                                    </div>
                                    :
                                    null
                            }
                            {
                                events.participant ?
                                    <div className="grid_col col-12 desktop-col-6">
                                        <ChatList events={events.participant} usersList={usersList} loading={loading} mapEventToFormFields={mapEventToFormFields} heading={translate('participant')} />
                                    </div>
                                    :
                                    null
                            }
                        </div>
                    :
                    <div className="grid">
                        <div className="grid_col col-12">
                            <Preloader/>
                        </div>
                    </div>
            }
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
        newFormFields.find(item => item.id === 'lesson').children[0].value = event.lesson;
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
        if ( fieldID === 'lessonPicker' ) {
            newFields.find(item => item.id === 'lesson').children.find(item => item.id === fieldID).value = value;
        }

        setFormFields(Object.assign([], newFields));
    }

    function onUpdateEvent() {
        let newEvent = {};

        const organizerField = formFields.find(item => item.id === 'block_organizer').children[0];
        const participantsField = formFields.find(item => item.id === 'block_participants').children[0];

        if ( !showEditModal.id ) {
            newEvent.id = generate({
                length: 20,
                numbers: true
            });
        }
        else {
            newEvent.id = showEditModal.id;
        }
        newEvent.organizer = organizerField.value;
        newEvent.participants = typeof participantsField.value === 'object' ? participantsField.value : [participantsField.value];
        if ( formFields.find(item => item.id === 'lesson').children[0].value ) {
            newEvent.lesson = formFields.find(item => item.id === 'lesson').children[0].value;
        }
        newEvent.name = formFields.find(item => item.id === 'info').children.find(item => item.id === 'name').value;
        newEvent.datetime = formFields.find(item => item.id === 'info').children.find(item => item.id === 'datepicker').value;

        updateEvent(newEvent.id, newEvent);
        setFormFields(Object.assign([], initialFormFields));
        setShowEditModal(false);
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
