import React, { memo, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";

import TextTooltip from "../TextTooltip/TextTooltip";
import { useGlobalNotificationContext } from "./context";

const GlobalNotifications = () => {
  const { notifications, removeNotification } = useGlobalNotificationContext();

  const handleRemoveNotification = useCallback(
    (id) => () => {
      removeNotification(id);
    },
    [],
  );

  return (
    <GlobalNotificationsHolderStyled>
      {notifications.map((item) => (
        <GlobalNotificationStyled key={item.id} isRemoved={item.isRemoved}>
          <GlobalNotificationTextStyled>
            <i className={item.icon} />
            {item.text}
          </GlobalNotificationTextStyled>
          <GlobalNotificationCloseBtnStyled>
            <TextTooltip
              text={"Закрити"}
              children={
                <i
                  className="far fa-times-circle"
                  onClick={item.onClose || handleRemoveNotification(item.id)}
                />
              }
              position="left"
            />
          </GlobalNotificationCloseBtnStyled>
        </GlobalNotificationStyled>
      ))}
    </GlobalNotificationsHolderStyled>
  );
};

export default memo(GlobalNotifications);

const showNotification = keyframes`
  0% { transform: translateX(calc(100% + 20px)); opacity: 0; }
  100% { transform: translateX(0) opacity: 1; }
`;

const hideNotification = keyframes`
  0% { transform: translateX(0) opacity: 1; }
  100% { transform: translateX(calc(100% + 20px)); opacity: 0; }
`;

const GlobalNotificationsHolderStyled = styled.div`
  position: fixed;
  bottom: 20px;
  z-index: 99999;
  right: 20px;
`;

const GlobalNotificationStyled = styled.div`
  position: relative;
  background: #7f00a3;
  padding: 25px 80px 25px 20px;
  border-radius: 4px;
  color: white;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 15%);
  margin-top: 10px;
  animation-name: ${showNotification};
  animation-duration: 0.25s;

  &:first-child {
    margin-top: 0;
  }

  ${({ isRemoved }) =>
    isRemoved &&
    css`
      animation-name: ${hideNotification};
    `}
`;

const GlobalNotificationTextStyled = styled.div`
  i {
    margin-right: 10px;
  }
  a {
    color: white;
    text-decoration: underline;
  }
`;

const GlobalNotificationCloseBtnStyled = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 24px;
  cursor: pointer;
`;
