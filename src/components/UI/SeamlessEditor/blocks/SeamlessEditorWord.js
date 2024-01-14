import React, { useContext } from "react";
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Form from "../../../../components/Form/Form";
import mammoth from "mammoth";
import MathJax from "react-mathjax-preview";

export default function SeamlessEditorWord({
  block,
  setBlock,
  openTextEditor,
}) {
  const { translate, lang } = useContext(siteSettingsContext);
  block.value = block.value || {
    ua: "",
    ru: "",
    en: "",
  };
  const formFields = [
    {
      type: "file",
      id: block.id,
      value: "",
      size: "100%",
      icon: "fas fa-file-word",
      customSize: true,
      label: translate("choose_file"),
      ext: ".docx",
    },
  ];

  return (
    <div className="seamlessEditor__editor-block-word">
      <Form
        fields={formFields}
        setFieldValue={(fieldID, value) => handleChange(fieldID, value)}
      />
      <br />
      {block.value && block.value[lang] ? (
        <div
          className="seamlessEditor__editor-block-text"
          onClick={() => openTextEditor(block)}
        >
          <MathJax math={block.value[lang]} />
        </div>
      ) : (
        <div className="seamlessEditor__editor-block-placeholder">
          {translate("word_will_be_here")}
        </div>
      )}
    </div>
  );

  function handleChange(id, value) {
    const reader = new FileReader();
    reader.onloadend = function (event) {
      const arrayBuffer = reader.result;

      mammoth
        .convertToHtml({ arrayBuffer: arrayBuffer })
        .then(function (resultObject) {
          setBlock({
            ...block,
            value: {
              ...block.value,
              [lang]: resultObject.value,
            },
          });
        });
    };
    reader.readAsArrayBuffer(value);
  }
}
