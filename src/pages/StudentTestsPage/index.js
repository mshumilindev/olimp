import React from "react";

import StudentTests from "../../components/StudentTests";
import Notifications from "../../components/Notifications/Notifications";

const StudentTestsPage = () => {
  return (
    <>
      <div className="content__title-holder">
        <h2 className="content__title">
          <i class="content_title-icon fa-solid fa-clipboard-question" />
          Тести
        </h2>
      </div>
      <Notifications />
      <StudentTests showChecked hideTitle hideBtn />
    </>
  );
};

export default StudentTestsPage;
