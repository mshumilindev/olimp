import React, { useContext } from "react";
import siteSettingsContext from "../../context/siteSettingsContext";
import StudentChatsList from "../../components/StudentChatsList/StudentChatsList";
import Notifications from "../../components/Notifications/Notifications";

export default function StudentChats() {
  const { translate } = useContext(siteSettingsContext);

  return (
    <div className="studentChats">
      <div className="content__title-holder">
        <h2 className="content__title">
          <i className="content_title-icon fas fa-video" />
          {translate("videochats")}
        </h2>
      </div>
      <Notifications />
      <section className="section">
        <StudentChatsList />
      </section>
    </div>
  );
}
