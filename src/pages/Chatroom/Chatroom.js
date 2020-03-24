/* global JitsiMeetExternalAPI */
import React, { useEffect, useContext, useState } from 'react';
import userContext from "../../context/userContext";
import {Preloader} from "../../components/UI/preloader";
import { fetchChat, setActiveUsers } from '../../redux/actions/eventsActions';
import { connect } from 'react-redux';
import siteSettingsContext from "../../context/siteSettingsContext";
import './chatroom.scss';
import moment from "moment";

function Chatroom({params, fetchChat, setActiveUsers, loading, chat, chatError}) {
    const { user } = useContext(userContext);
    const { translate } = useContext(siteSettingsContext);
    const [ userActive, setUserActive ] = useState(false);

    function startConference() {
        try {
            const domain = 'meet.jit.si';
            const options = {
                roomName: chat.roomName,
                height: 400,
                parentNode: document.getElementById('jitsi-container'),
                interfaceConfigOverwrite: {
                    filmStripOnly: true,
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    TOOLBAR_ALWAYS_VISIBLE: true,
                    DISPLAY_WELCOME_PAGE_CONTENT: false,
                    LANG_DETECTION: true,
                    TOOLBAR_BUTTONS: [],
                    DISABLE_TRANSCRIPTION_SUBTITLES: true,
                    defaultLogLevel: 'error',
                    loggingConfig: {
                        defaultLogLevel: 'error'
                    }
                },
                configOverwrite: {
                    disableSimulcast: true,
                    defaultLogLevel: 'error',
                    loggingConfig: {
                        defaultLogLevel: 'error'
                    }
                },
                defaultLogLevel: 'error',
                loggingConfig: {
                    defaultLogLevel: 'error'
                },
                startAudioOnly: true,
            };

            const api = new JitsiMeetExternalAPI(domain, options);
            api.addEventListener('videoConferenceJoined', () => {
                console.log('Local User Joined');
                api.executeCommand('displayName', user.name);
                api.executeCommand('avatarUrl', user.avatar);
            });
        } catch (error) {
            console.error('Failed to load Jitsi API', error);
        }
    }

    useEffect(() => {
        // const activeUsers = chat.activeUsers || [];

        fetchChat(params.chatID);

        // === Setting current user as active
        // setActiveUsers(params.chatID, user.id);
        // if ( JitsiMeetExternalAPI ) {
        //     // startConference();
        // }
    }, []);

    useEffect(() => {
        if ( !userActive ) {

        }
    }, [chat]);

    if ( chat ) {
        console.log(chat.datetime, moment().unix());
    }

    return (
        <div className="chatroom">
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className="content_title-icon fa fa-video"/>
                        { translate('videochat') }
                    </h2>
                </div>
                <div className="widget">
                    {
                        loading || ( !chatError && !chat ) ?
                            <Preloader/>
                            :
                            chatError ?
                                <div className="chatroom__error">{ chatError }</div>
                                :
                                _renderChatBox()
                    }
                </div>
                {/*<div id="jitsi-container" />*/}
            </section>
        </div>
    );

    function _renderChatBox() {
        return (
            <div className="chatroom__chatBox">
                This is chatbox
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.eventsReducer.loading,
        chat: state.eventsReducer.chat,
        chatError: state.eventsReducer.chatError
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchChat: (chatID) => dispatch(fetchChat(chatID)),
        setActiveUsers: (chatID, activeUsers) => dispatch(setActiveUsers(chatID, activeUsers))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chatroom);
