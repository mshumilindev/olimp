import React, { useState, useContext } from "react";
import Form from "../Form/Form";
import siteSettingsContext from "../../context/siteSettingsContext";
import MapContainer from "../../components/Map/Map";

function AdminSettingsSettings({ siteSettings, updateModel }) {
  const [siteSettingsFields, setSiteSettingsFields] = useState([]);
  const { translate } = useContext(siteSettingsContext);
  const [initialSiteSettings, setInitialSiteSettings] = useState(null);

  if (siteSettings !== initialSiteSettings) {
    const newFields = [
      {
        type: "image",
        id: "logo",
        size: "100%",
        label: translate("edit") + " " + translate("logo"),
        value: JSON.parse(siteSettings).logo.url,
        icon: "fa fa-image",
        shape: "landscape",
        ext: "PNG",
        backSize: "contain",
        maxSize: 500,
      },
      {
        type: "block",
        id: "siteName_block",
        heading: translate("site_name"),
        children: [
          {
            type: "text",
            id: "siteName_UA",
            placeholder: translate("site_name") + " " + translate("in_ua"),
            value: JSON.parse(siteSettings).siteName.ua,
          },
          {
            type: "text",
            id: "siteName_RU",
            placeholder: translate("site_name") + " " + translate("in_ru"),
            value: JSON.parse(siteSettings).siteName.ru,
          },
          {
            type: "text",
            id: "siteName_EN",
            placeholder: translate("site_name") + " " + translate("in_en"),
            value: JSON.parse(siteSettings).siteName.en,
          },
        ],
      },
      {
        type: "text",
        id: "address",
        value: JSON.parse(siteSettings).address.value,
        placeholder: translate("address"),
      },
    ];

    setInitialSiteSettings(siteSettings);
    setSiteSettingsFields(newFields);
  }

  return (
    <>
      <Form fields={siteSettingsFields} setFieldValue={updateModel} />
      <MapContainer address={JSON.parse(siteSettings).address.value} />
    </>
  );
}

export default AdminSettingsSettings;
