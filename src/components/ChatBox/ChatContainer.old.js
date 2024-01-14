import React, { useRef, useEffect, useContext, useState, memo } from "react";
import Jitsi from "./jitsi";
import Form from "../Form/Form";
import siteSettingsContext from "../../context/siteSettingsContext";
import { connect } from "react-redux";
import { JitsiMeeting } from "@jitsi/react-sdk";

const ChatContainer = ({
  user,
  chat,
  usersList,
  setIsFullScreen,
  setIsHidden,
  muteChat,
  shareScreen,
  setShareScreen,
  setUsersLength,
  onDisplayNameChange,
  noVideo,
  setApiRef,
  logo,
}) => {
  return (
    <div className="jitsi-container">
      <JitsiMeeting
        hiddenDomain={true}
        roomName={`olimp_remote_school_${chat.id}`}
        password={12345}
        configOverwrite={{
          startAudioMuted: true,
          defaultLanguage: "uk",
          toolbarButtons: [],
          conferenceInfo: {
            alwaysVisible: [],
            autoHide: [],
          },
          readOnlyName: true,
          prejoinPageEnabled: false,
          enableUserRolesBasedOnToken: true,
          remoteVideoMenu: {
            disabled: true,
          },
          hideDisplayName: true,
          resizeDesktopForPresenter: true,
        }}
        interfaceConfigOverwrite={{
          SHOW_CHROME_EXTENSION_BANNER: false,
          LANG_DETECTION: false,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        userInfo={{
          displayName: user.name,
        }}
        onApiReady={(externalApi) => {
          setApiRef(externalApi);

          externalApi.addEventListener(
            "participantJoined",
            ({ id, displayName }) => {
              setUsersLength(externalApi.getParticipantsInfo().length);
              if (user.role === "student") {
                externalApi.executeCommand("setTileView", false);
                externalApi.setLargeVideoParticipant(id);
              }
            },
          );

          externalApi.addEventListener(
            "participantLeft",
            ({ id, displayName }) => {
              setUsersLength(externalApi.getParticipantsInfo().length);
            },
          );
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100%";
        }}
      />
      <img
        src={logo.url}
        style={{
          position: "absolute",
          width: "100px",
          left: "18px",
          top: "28px",
        }}
      />
    </div>
  );
};

// function ChatContainer({user, chat, usersList, setIsFullScreen, setIsHidden, muteChat, shareScreen, setShareScreen, setUsersLength, onDisplayNameChange, noVideo}) {
//   const [ organizerChatID, setOrganizerChatID ] = useState(null);
//   const $localTracksContainer = useRef(null);
//   const $remoteTracksContainer = useRef(null);
//   const $shareScreenContainer = useRef(null);
//   const $mainContainer = useRef(null);
//   const [ videoDevices, setVideoDevices ] = useState(null);
//   const [ selectedVideoDevice, setSelectedVideoDevice ] = useState(localStorage.getItem('videoDevice') ? JSON.parse(localStorage.getItem('videoDevice')) : null);
//   const { translate } = useContext(siteSettingsContext);
//   let jitsi = new Jitsi();
//   const [ classes, setClasses ] = useState('chatroom__remoteTracks');
//
//   useEffect(() => {
//   jitsi.start({
//   containers: {
//   local: $localTracksContainer.current,
//   remote: $remoteTracksContainer.current,
//   shareScreen: $shareScreenContainer.current
//   },
//   user: user,
//   roomName: chat.id,
//   onDisplayNameChange: handleDisplayNameChange,
//   usersList: usersList,
//   onRemoteAdded: onRemoteAdded,
//   noVideo: noVideo
//   });
//   getVideoDevices();
//   addClasses();
//   document.addEventListener('click', pickVideo);
//   return () => {
//   document.removeEventListener('click', pickVideo);
//   jitsi.stop();
//   setIsFullScreen(false);
//   setIsHidden(false);
//   }
//   }, []);
//
//   useEffect(() => {
//   jitsi.toggleMute(muteChat);
//   }, [muteChat]);
//
//   useEffect(() => {
//   jitsi.toggleScreenShare(shareScreen, setShareScreen);
//   }, [shareScreen]);
//
//   useEffect(() => {
//   makeVideoMain();
//
//   const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
//   const obs = new MutationObserver((mutations) => {
//   setTimeout(() => {
//   makeVideoMain();
//   addClasses();
//   }, 0);
//   });
//   obs.observe( $remoteTracksContainer.current, { childList:true, subtree:true });
//   }, [organizerChatID]);
//
//   return (
//   <>
//   <div className="chatroom__chatContainer" ref={$mainContainer}>
//   <div className="chatroom__shareScreen" ref={$shareScreenContainer}/>
//   <div className="chatroom__localTracks" ref={$localTracksContainer}/>
//   <div className={classes} ref={$remoteTracksContainer}>
//   <i className="closeFullsizeVideo fa fa-times" />
//   </div>
//   </div>
//   {
//   videoDevices && videoDevices.length > 1 ?
//   <div className="chatroom__devicePicker">
//   <Form fields={[{type: 'select', placeholder: translate('video_devices'), value: selectedVideoDevice ? selectedVideoDevice.label : '', options: videoDevices, id: 'videoDevices'}]} setFieldValue={changeVideoDevice}/>
//   </div>
//   :
//   null
//   }
//   </>
//   );
//
//   function changeVideoDevice(fieldID, value) {
//   setSelectedVideoDevice({id: value, label: videoDevices.find(device => device.id === value).title});
//   jitsi.changeVideoDevice(value, videoDevices.find(device => device.id === value).title);
//   }
//
//   function pickVideo(e) {
//   if ( user.role !== 'student' ) {
//   if ( e.target.classList.contains('video') ) {
//   e.target.classList.toggle('fullsizeVideo');
//   $remoteTracksContainer.current.classList.toggle('hasFullsizeVideo');
//   }
//   else if ( e.target.closest('.video') ) {
//   e.target.closest('.video').classList.toggle('fullsizeVideo');
//   $remoteTracksContainer.current.classList.toggle('hasFullsizeVideo');
//   }
//   if ( e.target.classList.contains('closeFullsizeVideo') ) {
//   if ( $remoteTracksContainer.current.querySelector('.fullsizeVideo') ) {
//   $remoteTracksContainer.current.querySelector('.fullsizeVideo').classList.remove('fullsizeVideo');
//   }
//   $remoteTracksContainer.current.classList.remove('hasFullsizeVideo');
//   }
//   }
//   }
//
//   function handleDisplayNameChange(id, displayName) {
//   setTimeout(() => {
//   if ( usersList.find(item => item.name === displayName) && usersList.find(item => item.name === displayName).id === chat.organizer ) {
//   setOrganizerChatID(id ? id : 'local');
//   }
//   onDisplayNameChange(id, displayName);
//   }, 0);
//   }
//
//   function onRemoteAdded() {
//   setTimeout(() => {
//   makeVideoMain();
//   addClasses();
//   }, 0);
//   }
//
//   function makeVideoMain() {
//   if ( organizerChatID ) {
//   if ( organizerChatID === 'local' ) {
//   const video = $localTracksContainer.current.querySelector('.video');
//
//   if ( video ) {
//   video.classList.add('main-video');
//   }
//   }
//   else {
//   if ( $remoteTracksContainer.current ) {
//   const video = $remoteTracksContainer.current.querySelector(('.video' + organizerChatID));
//
//   if ( video ) {
//   video.classList.add('main-video');
//   }
//   }
//   }
//   }
//   if ( $mainContainer.current ) {
//   setUsersLength($mainContainer.current.querySelectorAll('audio').length + 1);
//   }
//   }
//
//   function addClasses() {
//   const initialClass = 'chatroom__remoteTracks';
//
//   if ( $remoteTracksContainer.current ) {
//   setClasses(initialClass + ' tracks_qty_' + $remoteTracksContainer.current.querySelectorAll('.video').length);
//   }
//   }
//
//   function getVideoDevices() {
//   navigator.mediaDevices.enumerateDevices().then(devices => {
//   const newDevices = devices.filter(device => device.kind === 'videoinput').map(device => {
//   return {
//   id: device.deviceId,
//   title: device.label
//   }
//   });
//   if ( newDevices.length ) {
//   setVideoDevices(newDevices);
//   }
//   });
//   }
// }

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.currentUser,
    logo: state.siteSettingsReducer.siteSettingsList
      ? state.siteSettingsReducer.siteSettingsList.logo
      : null,
  };
};

export default connect(mapStateToProps)(memo(ChatContainer));
