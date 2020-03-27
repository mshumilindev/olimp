import React, { useRef, useEffect, useContext, useState } from 'react';
import Jitsi from "./jitsi";
import userContext from "../../context/userContext";

export default function ChatContainer({chat, usersList}) {
    const [ organizerChatID, setOrganizerChatID ] = useState(null);
    const $localTracksContainer = useRef(null);
    const $remoteTracksContainer = useRef(null);
    const $chatroomUsersOrganizer = useRef(null);
    const $chatroomUsersParticipants = useRef(null);
    const { user } = useContext(userContext);

    useEffect(() => {
        let jitsi = new Jitsi();

        jitsi.start({
            containers: {
                local: $localTracksContainer.current,
                remote: $remoteTracksContainer.current,
                organizer: $chatroomUsersOrganizer.current,
                participants: $chatroomUsersParticipants.current
            },
            user: user,
            roomName: chat.id,
            onDisplayNameChange: onDisplayNameChange,
            usersList: usersList,
            onRemoteAdded: onRemoteAdded
        });
        return () => {
            jitsi.stop();
        }
    }, []);

    useEffect(() => {
        makeVideoMain();

        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        const obs = new MutationObserver((mutations) => {
            setTimeout(() => {
                makeVideoMain();
            }, 0);
        });
        obs.observe( $remoteTracksContainer.current, { childList:true, subtree:true });
    }, [organizerChatID]);

    return (
        <>
            <div className="chatroom__users">
                <div className="chatroom__users-organizer" ref={$chatroomUsersOrganizer} />
                <div className="chatroom__users-participants" ref={$chatroomUsersParticipants} />
            </div>
            <div className="chatroom__chatContainer">
                <div className="chatroom__localTracks" ref={$localTracksContainer}/>
                <div className="chatroom__remoteTracks" ref={$remoteTracksContainer}/>
            </div>
        </>
    );

    function onDisplayNameChange(id, displayName) {
        if ( usersList.find(item => item.name === displayName).id === chat.organizer ) {
            setOrganizerChatID(id ? id : 'local');
        }
    }

    function onRemoteAdded() {
        makeVideoMain();
    }

    function makeVideoMain() {
        if ( organizerChatID ) {
            if ( organizerChatID === 'local' ) {
                const video = $localTracksContainer.current.querySelector('video');

                if ( video ) {
                    video.classList.add('main-video');
                }
            }
            else {
                const video = $remoteTracksContainer.current.querySelector(('#video' + organizerChatID));

                if ( video ) {
                    video.classList.add('main-video');
                }
            }
        }
    }
}

/* global JitsiMeetExternalAPI */

// import React, {useContext, useEffect, useRef} from 'react';
// import userContext from "../../context/userContext";
//
// let api = null;
//
// export default function ChatContainer({chat}) {
//     const { user } = useContext(userContext);
//     const $chatContainer = useRef(null);
//
//     useEffect(() => {
//         if ( JitsiMeetExternalAPI ) {
//             startConference();
//         }
//         return () => {
//             if ( api ) {
//                 api.executeCommand('hangup');
//                 api.removeEventListener('videoConferenceJoined', handleStartChat);
//                 $chatContainer.current.innerHTML = '';
//                 api = null;
//             }
//         }
//     }, []);
//
//     return (
//         <div className="chatroom__chatContainer" ref={$chatContainer}/>
//     );
//
//     function handleStartChat(id) {
//         api.executeCommand('avatarUrl', user.avatar);
//         api.executeCommand('toggleTileView');
//     }
//
//     function startConference() {
//         try {
//             const domain = 'meet.jit.si';
//             const options = {
//                 roomName: chat.id,
//                 parentNode: $chatContainer.current,
//                 interfaceConfigOverwrite: {
//                     filmStripOnly: false,
//                     SHOW_JITSI_WATERMARK: false,
//                     SHOW_WATERMARK_FOR_GUESTS: false,
//                     TOOLBAR_ALWAYS_VISIBLE: true,
//                     DISPLAY_WELCOME_PAGE_CONTENT: false,
//                     LANG_DETECTION: true,
//                     TOOLBAR_BUTTONS: [],
//                     DISABLE_TRANSCRIPTION_SUBTITLES: true,
//                     DEFAULT_REMOTE_DISPLAY_NAME: user.name,
//                     AUTHENTICATION_ENABLE: false,
//                     VERTICAL_FILMSTRIP: false
//                 },
//                 configOverwrite: {
//                     disableSimulcast: true
//                 }
//             };
//
//             // setApi(new JitsiMeetExternalAPI(domain, options));
//             api = new JitsiMeetExternalAPI(domain, options);
//
//             api.addEventListener('videoConferenceJoined', ({id}) => handleStartChat(id));
//         } catch (error) {
//             console.error('Failed to load Jitsi API', error);
//         }
//     }
// }
