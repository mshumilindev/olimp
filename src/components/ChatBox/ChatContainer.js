import React, { useRef, useEffect, useContext, useState } from 'react';
import Jitsi from "./jitsi";
import userContext from "../../context/userContext";

export default function ChatContainer({chat, usersList, setIsFullScreen, setIsHidden, muteChat, shareScreen, setShareScreen, isStopping}) {
    const [ organizerChatID, setOrganizerChatID ] = useState(null);
    const $localTracksContainer = useRef(null);
    const $remoteTracksContainer = useRef(null);
    const $chatroomUsersOrganizer = useRef(null);
    const $chatroomUsersParticipants = useRef(null);
    const $shareScreenContainer = useRef(null);
    const { user } = useContext(userContext);
    let jitsi = new Jitsi();

    useEffect(() => {
        jitsi.start({
            containers: {
                local: $localTracksContainer.current,
                remote: $remoteTracksContainer.current,
                organizer: $chatroomUsersOrganizer.current,
                participants: $chatroomUsersParticipants.current,
                shareScreen: $shareScreenContainer.current
            },
            user: user,
            roomName: chat.id,
            onDisplayNameChange: onDisplayNameChange,
            usersList: usersList,
            onRemoteAdded: onRemoteAdded
        });
        return () => {
            jitsi.stop();
            setIsFullScreen(false);
            setIsHidden(false);
        }
    }, []);

    useEffect(() => {
        jitsi.toggleMute(muteChat);
    }, [muteChat]);

    useEffect(() => {
        jitsi.toggleScreenShare(shareScreen, setShareScreen);
    }, [shareScreen]);

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
                <div className="chatroom__shareScreen" ref={$shareScreenContainer}/>
                <div className="chatroom__localTracks" ref={$localTracksContainer}/>
                <div className="chatroom__remoteTracks" ref={$remoteTracksContainer}/>
            </div>
        </>
    );

    function onDisplayNameChange(id, displayName) {
        setTimeout(() => {
            if ( usersList.find(item => item.name === displayName).id === chat.organizer ) {
                setOrganizerChatID(id ? id : 'local');
            }
        }, 0);
    }

    function onRemoteAdded() {
        setTimeout(() => {
            makeVideoMain();
        }, 0);
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