import React, { memo } from 'react';
import { connect } from 'react-redux';
import { JaaSMeeting, JitsiMeeting } from '@jitsi/react-sdk'

const ChatContainer = ({user, chat, setUsersLength, setApiRef, logo}) => {
  return (
    <div className="jitsi-container">
      {/* <JitsiMeeting
        hiddenDomain={true}
        roomName={`olimp_remote_school_${chat.id}`}
        password={12345}
        configOverwrite = {{
          startAudioMuted: true,
          defaultLanguage: 'uk',
          toolbarButtons: [],
          conferenceInfo: {
            alwaysVisible: [],
            autoHide: []
          },
          readOnlyName: true,
          prejoinPageEnabled: false,
          enableUserRolesBasedOnToken: true,
          remoteVideoMenu: {
            disabled: true
          },
          hideDisplayName: true,
          resizeDesktopForPresenter: true
        }}
        interfaceConfigOverwrite={{
            SHOW_CHROME_EXTENSION_BANNER: false,
            LANG_DETECTION: false,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
        }}
        userInfo={{
          displayName: user.name,
        }}
        onApiReady={(externalApi) => {
          setApiRef(externalApi);

          externalApi.addEventListener('participantJoined', ({id, displayName}) => {
            setUsersLength(externalApi.getParticipantsInfo().length)
            if ( user.role === 'student' ) {
              externalApi.executeCommand('setTileView', false);
              externalApi.setLargeVideoParticipant(id);
            }
          });

          externalApi.addEventListener('participantLeft', ({id, displayName}) => {
            setUsersLength(externalApi.getParticipantsInfo().length)
          });
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
        }}
      /> */}
      <JaaSMeeting
          appId={'vpaas-magic-cookie-b98fc17dfda2455394c918406af64915'}
          roomName={`olimp_remote_school_${chat.id}`}
          onApiReady={(externalApi) => {
            setApiRef(externalApi);
  
            externalApi.addEventListener('participantJoined', ({id, displayName}) => {
              setUsersLength(externalApi.getParticipantsInfo().length)
              if ( user.role === 'student' ) {
                externalApi.executeCommand('setTileView', false);
                externalApi.setLargeVideoParticipant(id);
              }
            });
  
            externalApi.addEventListener('participantLeft', ({id, displayName}) => {
              setUsersLength(externalApi.getParticipantsInfo().length)
            });
          }}
          hiddenDomain={true}
          password={12345}
          configOverwrite = {{
            startAudioMuted: true,
            defaultLanguage: 'uk',
            toolbarButtons: [],
            conferenceInfo: {
              alwaysVisible: [],
              autoHide: []
            },
            readOnlyName: true,
            prejoinPageEnabled: false,
            enableUserRolesBasedOnToken: true,
            remoteVideoMenu: {
              disabled: true
            },
            hideDisplayName: true,
            resizeDesktopForPresenter: true
          }}
          interfaceConfigOverwrite={{
              SHOW_CHROME_EXTENSION_BANNER: false,
              LANG_DETECTION: false,
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
          }}
          userInfo={{
            displayName: user.name,
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100%';
          }}
        />
      <img src={ logo.url } style={{
        position: 'absolute',
        width: '100px',
        left: '18px',
        top: '28px',
      }} />
    </div>
  )
}

const mapStateToProps = state => {
    return {
        user: state.authReducer.currentUser,
        logo: state.siteSettingsReducer.siteSettingsList ? state.siteSettingsReducer.siteSettingsList.logo : null,
    }
};

export default connect(mapStateToProps)(memo(ChatContainer));
