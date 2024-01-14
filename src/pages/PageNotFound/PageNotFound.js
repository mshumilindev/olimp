import React, { useContext } from "react";
import siteSettingsContext from "../../context/siteSettingsContext";

export default function PageNotFound() {
  const { translate } = useContext(siteSettingsContext);

  return (
    <div className="pageNotFound">
      <i className="content_title-icon fa fa-unlink" />
      {translate("page_not_found")}
    </div>
  );
}
