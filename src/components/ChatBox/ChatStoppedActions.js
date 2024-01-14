import React, { useContext, useEffect, memo } from 'react';
import classNames from 'classnames';
import moment from "moment";
import 'moment/locale/uk';
import 'moment/locale/ru';
import 'moment/locale/en-gb';

import TextTooltip from "../UI/TextTooltip/TextTooltip";
import siteSettingsContext from "../../context/siteSettingsContext";

import ChatInfo from "./ChatInfo";
import ChatUnconditional from "./ChatUnconditional";

const ChatStoppedActions = ({
  isChatPage,
  currentChatOrganizer,
  chat,
  usersPresent,
  usersList,
  handleChalkBoard,
  startChat,
  hasToParticipate
}) => {
  const { translate, lang } = useContext(siteSettingsContext);

  useEffect(() => {
      if ( lang === 'ua' ) {
          moment.locale('uk');
      }
      if ( lang === 'ru' ) {
          moment.locale('ru');
      }
      if ( lang === 'en' ) {
          moment.locale('en-gb');
      }
  }, [lang]);

  if ( !isChatPage ) return null;

  if ( currentChatOrganizer ) {
    return (
      <>
        <div className="chatroom__message-holder" style={chat.chalkBoardOpen ? {zIndex: 100} : null}>
          <ChatInfo isStatic={true} chat={chat} />
          <div className="chatroom__info">
            <ChatUnconditional chat={chat} currentChatOrganizer={currentChatOrganizer} usersPresent={usersPresent} usersList={usersList} />
            <span>
              <i className="fas fa-eye-slash"/>
              { translate('you_can_start_chat') }
            </span>
          </div>
        </div>
        <div className="chatroom__btnsHolder">
          <TextTooltip position="top" text={translate('prepare_chalkboard')} children={
            <span
              className={classNames('btn round', {
                btn_primary: !chat.chalkBoardOpen,
                'btn__success btn__working': chat.chalkBoardOpen
              })}
              onClick={handleChalkBoard}
            >
              <i className="fas fa-pencil-alt" />
            </span>
          }/>
          <span className="btn btn__success round" onClick={startChat}><i className="fas fa-phone" /></span>
        </div>
      </>
    )
  }

  return (
    <div className="chatroom__message-holder">
      <ChatInfo isStatic={true} chat={chat} />
      <div className="chatroom__info">
        {
          chat.datetime - moment().unix() > 3600 ?
            <span>
              <i className="far fa-clock"/>
              <span>
                { translate('videochat_will_start_at') }
                { moment(chat.datetime * 1000).format(' HH:mm, DD MMMM YYYY') }
              </span>
            </span>
            :
            <span>
              <i className="fas fa-eye-slash"/>
              { translate('chat_will_start_soon') }
            </span>
        }
      </div>
    </div>
  );
}

export default memo(ChatStoppedActions);
