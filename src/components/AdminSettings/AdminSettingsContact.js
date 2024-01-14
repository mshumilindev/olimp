import React, { useState, useContext } from "react";
import Form from "../Form/Form";
import siteSettingsContext from "../../context/siteSettingsContext";

function AdminSettingsContact({
  contacts,
  addBlock,
  removeBlock,
  updateModel,
}) {
  const [contactFields, setContactFields] = useState([]);
  const { translate, lang } = useContext(siteSettingsContext);
  const [initialContacts, setInitialContacts] = useState(null);

  if (contacts !== initialContacts) {
    const newFields = [];

    JSON.parse(contacts)
      .sort((a, b) => a.order - b.order)
      .forEach((item) => {
        const newField = {
          type: "block",
          id: item.id,
          heading: item.name[lang] ? item.name[lang] : item.name["ua"],
          btnRemove: function () {
            removeBlock(item.id);
          },
          children: [
            {
              type: "text",
              placeholder: translate("name") + " " + translate("in_ua"),
              id: item.id + "_nameUA",
              value: item.name["ua"],
              updated: false,
            },
            {
              type: "text",
              placeholder: translate("name") + " " + translate("in_ru"),
              id: item.id + "_nameRU",
              value: item.name["ru"],
              updated: false,
            },
            {
              type: "text",
              placeholder: translate("name") + " " + translate("in_en"),
              id: item.id + "_nameEN",
              value: item.name["en"],
              updated: false,
            },
            {
              type: "text",
              placeholder: translate("tel"),
              id: item.id + "_tel",
              value: item.phone,
              updated: false,
            },
          ],
        };

        newFields.push(newField);
      });
    newFields.push({
      type: "button",
      name: "add",
      id: "add_contact",
      icon: "fa fa-plus",
      action: function () {
        addBlock();
      },
    });
    setContactFields(newFields);
    setInitialContacts(contacts);
  }

  return <Form fields={contactFields} setFieldValue={updateModel} />;
}

export default AdminSettingsContact;
