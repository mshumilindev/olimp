/* global JitsiMeetExternalAPI */
import React, { useEffect, useContext } from 'react';
import userContext from "../../context/userContext";
import siteSettingsContext from "../../context/siteSettingsContext";
import moment from "moment";

function ChatBox({setActiveUser, chat, users}) {
    const { user } = useContext(userContext);
    const { translate } = useContext(siteSettingsContext);

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
        return () => {
            removeFromActiveUsers();
            // Add removal from active users upon 'participantLeft' event in video chat
        }
    }, []);

    useEffect(() => {
        // === If chat.started === true
        // if ( JitsiMeetExternalAPI ) {
        //     // startConference();
        // }

        if ( chat && (!chat.activeUsers || !chat.activeUsers.length || chat.activeUsers.indexOf(user.id) === -1) ) {
            const newActiveUsers = chat.activeUsers || [];

            if ( newActiveUsers.indexOf(user.id) === -1 ) {
                newActiveUsers.push(user.id);
            }

            setActiveUser(chat.id, newActiveUsers);
        }
    }, [chat]);

    return (
        <div className="chatroom__chatBox">
            {/*<div id="jitsi-container" />*/}
            {
                users && chat.activeUsers && user.role !== 'student' ?
                    <div className="chatroom__users">
                        {
                            _renderUserItem(chat.activeUsers.indexOf(users.find(userItem => userItem.id === chat.organizer).id) !== -1 ? 'activeUser' : 'inactiveUser', users.find(userItem => userItem.id === chat.organizer))
                        }
                        {
                            users
                                .filter(userItem => userItem.id !== chat.organizer)
                                .filter(userItem => chat.activeUsers.indexOf(userItem.id) !== -1)
                                .map(userItem => _renderUserItem('activeUser', userItem))
                        }
                        {
                            users
                                .filter(userItem => userItem.id !== chat.organizer)
                                .filter(userItem => chat.activeUsers.indexOf(userItem.id) === -1)
                                .map(userItem => _renderUserItem('inactiveUser', userItem))
                        }
                    </div>
                    :
                    null

            }
            {/*{*/}
            {/*        users*/}
            {/*            .filter(userItem => chat.activeUsers.indexOf(userItem.id))*/}
            {/*            .sort()*/}
            {/*}*/}
        </div>
    );

    function _renderUserItem(type, userItem) {
        return (
            <div className={'chatroom__users-item ' + type}>
                <div className="chatroom__users-item-avatar-holder">
                    {
                        userItem.avatar ?
                            <div className="chatroom__users-item-avatar" style={{ backgroundImage: 'url(' + userItem.avatar + ')' }} />
                            :
                            <i className="chatroom__users-item-avatar-placeholder fa fa-user"/>
                    }
                </div>
                <div className="chatroom__users-item-name">
                    { userItem.name }
                </div>
            </div>
        );
    }

    function removeFromActiveUsers() {
        if ( chat && chat.activeUsers && chat.activeUsers.length && chat.activeUsers.indexOf(user.id) > -1 ) {
            console.log(chat.activeUsers.splice(chat.activeUsers.indexOf(user.id), 1));
            setActiveUser(chat.id, chat.activeUsers.splice(chat.activeUsers.indexOf(user.id), 1));
        }
    }
}

export default ChatBox;
