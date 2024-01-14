import React, { useContext } from "react";
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Form from "../../../../components/Form/Form";
import ImageEditor from "../../ImageEditor/ImageEditor";

export default function SeamlessEditorImage({ block, setBlock }) {
  const { translate, lang } = useContext(siteSettingsContext);
  block.value = block.value || {};
  block.value.image = block.value.image || "";
  block.value.settings = block.value.settings || {};
  block.value.caption = block.value.caption || {
    ua: "",
    ru: "",
    en: "",
  };
  const formFields = [
    {
      type: "text",
      id: block.id + "_caption",
      value: block.value.caption[lang],
      placeholder: translate("caption"),
      saveSize: 500,
    },
  ];

  return (
    <div className="seamlessEditor__editor-block-image">
      <ImageEditor
        image={block.value.image}
        settings={block.value.settings}
        handleChange={handleChange}
        id={block.id}
        setSettings={setSettings}
      />
      <Form
        fields={formFields}
        setFieldValue={(fieldID, value) => handleChange(fieldID, value)}
      />
    </div>
  );

  function handleChange(id, value) {
    let newValue = {
      value: block.value,
    };

    if (id.includes("image")) {
      newValue.value.image = value || block.value.image;
    } else {
      newValue.value.caption[lang] = value;
    }

    setBlock({
      ...block,
      ...newValue,
    });
  }

  function setSettings(newSettings) {
    setBlock({
      ...block,
      value: {
        ...block.value,
        settings: newSettings,
      },
    });
  }
}
