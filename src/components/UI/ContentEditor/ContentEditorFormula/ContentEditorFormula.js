import React, { useContext, useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Confirm from "../../Confirm/Confirm";
import MathJax from "react-mathjax-preview";

export default function ContentEditorFormula({
  block,
  setBlock,
  removeBlock,
  noBtns,
}) {
  const { translate, lang } = useContext(siteSettingsContext);
  const [showRemoveBlock, setShowRemoveBlock] = useState(false);
  const $wrapper = useRef(null);
  const editorToolbar = [
    "tiny_mce_wiris_formulaEditor | tiny_mce_wiris_formulaEditorChemistry",
  ];

  const editorConfig = {
    menubar: false,
    language: "uk",
    max_height: 550,
    // external_plugins: {
    //   tiny_mce_wiris:
    //     "https://cdn.jsdelivr.net/npm/@wiris/mathtype-tinymce4@7.29.0/plugin.min.js",
    // },
    plugins: ["autoresize"],
    toolbar: editorToolbar,
    placeholder: translate("enter_formula"),
  };

  block.value = block.value || {
    ua: "",
    ru: "",
    en: "",
  };

  return (
    <div className="contentEditor__block-text" ref={$wrapper}>
      <Editor
        initialValue={block.value[lang]}
        onEditorChange={handleChange}
        init={editorConfig}
        apiKey="5wvj56289tu06v7tziccawdyxaqxkmsxzzlrh6z0aia0pm8y"
      />
      {!noBtns ? (
        <>
          <div className="contentEditor__block-actions">
            {/*<span className="contentEditor__block-actions-sort">*/}
            {/*  <i className="content_title-icon fa fa-sort"/>*/}
            {/*</span>*/}
            <a
              href="/"
              onClick={(e) => onRemoveBlock(e)}
              className="contentEditor__block-actions-remove"
            >
              <i className="content_title-icon fa fa-trash-alt" />
            </a>
          </div>
          {showRemoveBlock ? (
            <Confirm
              message={translate("sure_to_remove_block")}
              confirmAction={() => removeBlock(block)}
              cancelAction={() => setShowRemoveBlock(false)}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );

  function onRemoveBlock(e) {
    e.preventDefault();

    setShowRemoveBlock(true);
  }

  function handleChange(value) {
    const newValue = block.value;
    newValue[lang] = value;

    setBlock({
      ...block,
      value: newValue,
    });
  }
}
