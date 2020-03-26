/* global JitsiMeetExternalAPI */

import React, {useContext, useEffect, useRef} from 'react';
import userContext from "../../context/userContext";

let api = null;

export default function ChatContainer({chat, setActiveUser, removeActiveUser}) {
    const { user } = useContext(userContext);
    const $chatContainer = useRef(null);

    useEffect(() => {
        if ( JitsiMeetExternalAPI ) {
            startConference();
        }
        return () => {
            if ( api ) {
                api.executeCommand('hangup');
                api.removeEventListener('videoConferenceJoined', handleStartChat);
                $chatContainer.current.innerHTML = '';
                api = null;
            }
        }
    }, []);

    useEffect(() => {
        api.removeEventListener('participantLeft', removeFromActiveUsers);
        api.addEventListener('participantLeft', (userLeft) => removeFromActiveUsers(userLeft.id));
    }, [chat.activeUsers]);

    return (
        <div className="chatroom__chatContainer" ref={$chatContainer}/>
    );

    function handleSetActiveUser(id) {
        if ( chat && (!chat.activeUsers || !chat.activeUsers.length || !chat.activeUsers.find(activeItem => activeItem.name === user.name)) ) {
            const newActiveUsers = chat.activeUsers || [];

            newActiveUsers.push({
                id: id,
                name: user.name
            });

            setActiveUser(chat.id, newActiveUsers);
        }
    }

    function removeFromActiveUsers(id) {
        if ( chat && chat.activeUsers && chat.activeUsers.length && chat.activeUsers.find(activeItem => activeItem.id === id) ) {
            removeActiveUser(chat.id, chat.activeUsers.filter(activeItem => activeItem.id !== id));
        }
    }

    function handleStartChat(id) {
        api.executeCommand('avatarUrl', user.avatar);
        api.executeCommand('toggleTileView');
        handleSetActiveUser(id);
    }

    function startConference() {
        try {
            const domain = 'meet.jit.si';
            const options = {
                roomName: chat.id,
                parentNode: $chatContainer.current,
                interfaceConfigOverwrite: {
                    filmStripOnly: true,
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    TOOLBAR_ALWAYS_VISIBLE: true,
                    DISPLAY_WELCOME_PAGE_CONTENT: false,
                    LANG_DETECTION: true,
                    TOOLBAR_BUTTONS: [],
                    DISABLE_TRANSCRIPTION_SUBTITLES: true,
                    DEFAULT_REMOTE_DISPLAY_NAME: user.name,
                    AUTHENTICATION_ENABLE: false,
                },
                configOverwrite: {
                    disableSimulcast: true
                },
                startAudioOnly: true,
            };

            // setApi(new JitsiMeetExternalAPI(domain, options));
            api = new JitsiMeetExternalAPI(domain, options);

            api.addEventListener('videoConferenceJoined', ({id}) => handleStartChat(id));
        } catch (error) {
            console.error('Failed to load Jitsi API', error);
        }
    }
}
