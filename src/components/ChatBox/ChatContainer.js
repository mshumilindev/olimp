import React, { useRef, useEffect, useContext, useState } from 'react';
import Jitsi from "./jitsi";
import userContext from "../../context/userContext";
import Form from "../Form/Form";
import siteSettingsContext from "../../context/siteSettingsContext";

export default function ChatContainer({chat, usersList, setIsFullScreen, setIsHidden, muteChat, shareScreen, setShareScreen, isStopping}) {
    const [ organizerChatID, setOrganizerChatID ] = useState(null);
    const $localTracksContainer = useRef(null);
    const $remoteTracksContainer = useRef(null);
    const $chatroomUsersOrganizer = useRef(null);
    const $chatroomUsersParticipants = useRef(null);
    const $shareScreenContainer = useRef(null);
    const [ videoDevices, setVideoDevices ] = useState(null);
    const [ selectedVideoDevice, setSelectedVideoDevice ] = useState(localStorage.getItem('videoDevice') ? JSON.parse(localStorage.getItem('videoDevice')) : null);
    const { user } = useContext(userContext);
    const { translate } = useContext(siteSettingsContext);
    let jitsi = new Jitsi();
    const [ classes, setClasses ] = useState('chatroom__remoteTracks');

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
        getVideoDevices();
        addClasses();
        document.addEventListener('click', pickVideo);
        return () => {
            document.removeEventListener('click', pickVideo);
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
                addClasses();
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
                <div className={classes} ref={$remoteTracksContainer}>
                    <i className="closeFullsizeVideo fa fa-times" />
                </div>
            </div>
            {
                videoDevices && videoDevices.length > 1 ?
                    <div className="chatroom__devicePicker">
                        <Form fields={[{type: 'select', placeholder: translate('video_devices'), value: selectedVideoDevice ? selectedVideoDevice.label : '', options: videoDevices, id: 'videoDevices'}]} setFieldValue={changeVideoDevice}/>
                    </div>
                    :
                    null
            }
        </>
    );

    function changeVideoDevice(fieldID, value) {
        setSelectedVideoDevice({id: value, label: videoDevices.find(device => device.id === value).title});
        jitsi.changeVideoDevice(value, videoDevices.find(device => device.id === value).title);
    }

    function pickVideo(e) {
        if ( user.role !== 'student' ) {
            if ( e.target.tagName === 'VIDEO' ) {
                e.target.classList.toggle('fullsizeVideo');
                $remoteTracksContainer.current.classList.toggle('hasFullsizeVideo');
            }
            if ( e.target.classList.contains('closeFullsizeVideo') ) {
                if ( $remoteTracksContainer.current.querySelector('.fullsizeVideo') ) {
                    $remoteTracksContainer.current.querySelector('.fullsizeVideo').classList.remove('fullsizeVideo');
                }
                $remoteTracksContainer.current.classList.remove('hasFullsizeVideo');
            }
        }
    }

    function onDisplayNameChange(id, displayName) {
        setTimeout(() => {
            if ( usersList.find(item => item.name === displayName) && usersList.find(item => item.name === displayName).id === chat.organizer ) {
                setOrganizerChatID(id ? id : 'local');
            }
        }, 0);
    }

    function onRemoteAdded() {
        setTimeout(() => {
            makeVideoMain();
            addClasses();
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

    function addClasses() {
        const initialClass = 'chatroom__remoteTracks';

        if ( $remoteTracksContainer.current ) {
            setClasses(initialClass + ' tracks_qty_' + $remoteTracksContainer.current.querySelectorAll('video').length);
        }
    }

    function getVideoDevices() {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const newDevices = devices.filter(device => device.kind === 'videoinput').map(device => {
                return {
                    id: device.deviceId,
                    title: device.label
                }
            });
            if ( newDevices.length ) {
                setVideoDevices(newDevices);
            }
        });
    }
}