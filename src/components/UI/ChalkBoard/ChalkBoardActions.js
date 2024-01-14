import React, { useContext, memo } from 'react';
import classNames from 'classnames';

import siteSettingsContext from "../../../context/siteSettingsContext";
import TextTooltip from "../../UI/TextTooltip/TextTooltip";

const ChalkBoardActions = ({shareBoard, eraseBoard, toggleChalkBoard, chat, hasText, hasDrawing, hasImg, activeBoard, switchBoard}) => {
  const { translate } = useContext(siteSettingsContext);

  return (
    <div className="chalkBoard__actions">
      <div className="chalkBoard__actions-row">
        <div className="chalkBoard__actionsItem">
          <TextTooltip position="left" text="Текст" children={
            <span className={classNames('btn btn_primary round', {inactive: activeBoard !== 'text'})} onClick={switchBoard('text')}>
              <i className="fas fa-font"/>
            </span>
          }/>
        </div>
        <div className="chalkBoard__actionsItem">
          <TextTooltip position="left" text="Малюнок" children={
            <span className={classNames('btn btn_primary round', {inactive: activeBoard !== 'drawing'})} onClick={switchBoard('drawing')}>
              <i className="fas fa-paint-brush"/>
            </span>
          }/>
        </div>
      </div>
      <div className="chalkBoard__actions-row">
        <div className="chalkBoard__actionsItem">
          <TextTooltip position="left" text={translate('send')} children={
            <span className="btn btn_primary round" onClick={shareBoard}>
              <i className="fas fa-share"/>
            </span>
          }/>
        </div>
        <div className="chalkBoard__actionsItem">
          <TextTooltip position="left" text={translate('erase')} children={
            <span className="btn btn__error round" onClick={eraseBoard}>
              <i className="fas fa-eraser"/>
            </span>
          }/>
        </div>
      </div>
      <div className="chalkBoard__actions-row">
        <div className="chalkBoard__actionsItem">
          <TextTooltip position="left" text={translate('close_chalkboard')} children={
            <span className="btn btn_primary round" onClick={() => toggleChalkBoard(chat.id, false)}>
              <i className="fas fa-times"/>
            </span>
          }/>
        </div>
      </div>
    </div>
  )
}

export default memo(ChalkBoardActions);
