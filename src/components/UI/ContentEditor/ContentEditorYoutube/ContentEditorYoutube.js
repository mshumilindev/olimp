import React, { useContext, useState, useRef } from "react";
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Confirm from "../../Confirm/Confirm";
import ReactPlayer from "react-player";

export default function ContentEditorYoutube({ block, setBlock, removeBlock }) {
  const { translate } = useContext(siteSettingsContext);
  const [showRemoveBlock, setShowRemoveBlock] = useState(false);
  block.value = block.value || "";

  const videoContainerRef = useRef(null);

  return (
    <div className="contentEditor__block-youtube" ref={videoContainerRef}>
      <form className="form">
        <input
          type="text"
          className="form__field"
          value={block.value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={translate("enter_youtube_url")}
        />
      </form>
      {block.value ? (
        <div className="contentEditor__block-youtube-holder">
          <ReactPlayer url={block.value} width={"auto"} height={"auto"} />
        </div>
      ) : null}
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
    </div>
  );

  function onRemoveBlock(e) {
    e.preventDefault();

    setShowRemoveBlock(true);
  }

  function handleChange(value) {
    setBlock({
      ...block,
      value: value,
    });
  }
}
