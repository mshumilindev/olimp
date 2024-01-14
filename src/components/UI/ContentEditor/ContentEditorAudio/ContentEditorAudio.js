import React, { useContext, useState } from "react";
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Confirm from "../../Confirm/Confirm";
import ContentEditorInstructions from "../ContentEditorActions/ContentEditorInstructions";
import * as instructionsJSON from "./instructions/instructions";

const instructions = instructionsJSON.default;

export default function ContentEditorAudio({ block, setBlock, removeBlock }) {
  const { translate } = useContext(siteSettingsContext);
  const [showRemoveBlock, setShowRemoveBlock] = useState(false);
  block.value = block.value || {
    caption: "",
    url: "",
  };

  return (
    <div className="contentEditor__block-audio">
      <form className="form">
        <div className="form__row">
          <input
            type="text"
            className="form__field"
            value={block.value.caption}
            onChange={(e) => handleChange("caption", e.target.value)}
            placeholder={translate("enter_audio_caption")}
          />
        </div>
        <div className="form__row">
          <input
            type="text"
            className="form__field"
            value={block.value.url}
            onChange={(e) => handleChange("url", e.target.value)}
            placeholder={translate("enter_audio_url")}
          />
        </div>
      </form>
      <br />
      {block.value.url ? (
        <audio controls>
          <source src={getPlayLink(block.value.url)} />
        </audio>
      ) : null}
      <div className="contentEditor__block-actions">
        {/*<span className="contentEditor__block-actions-sort">*/}
        {/*  <i className="content_title-icon fa fa-sort"/>*/}
        {/*</span>*/}
        <ContentEditorInstructions
          instructions={instructions}
          heading={"how_to_add_audio"}
        />
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
    </div>
  );

  function getPlayLink(url) {
    let newURL = url;

    if (newURL.indexOf("https://drive.google.com/file/d/") !== -1) {
      newURL = newURL.replace("https://drive.google.com/file/d/", "");
    }
    if (newURL.indexOf("https://drive.google.com/open?id=") !== -1) {
      newURL = newURL.replace("https://drive.google.com/open?id=", "");
    }
    if (newURL.indexOf("/view?usp=sharing") !== -1) {
      newURL = newURL.replace("/view?usp=sharing", "");
    }

    if (newURL.length) {
      newURL = "https://docs.google.com/uc?export=download&id=" + newURL;
    }

    return newURL;
  }

  function onRemoveBlock(e) {
    e.preventDefault();

    setShowRemoveBlock(true);
  }

  function handleChange(type, value) {
    const newValue = block.value;

    newValue[type] = value;

    setBlock({
      ...block,
      value: newValue,
    });
  }
}
