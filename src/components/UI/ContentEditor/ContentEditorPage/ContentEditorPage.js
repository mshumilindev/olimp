import React, { useContext, useState } from "react";
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Confirm from "../../Confirm/Confirm";

export default function ContentEditorPage({ block, setBlock, removeBlock }) {
  const { translate } = useContext(siteSettingsContext);
  const [showRemoveBlock, setShowRemoveBlock] = useState(false);

  return (
    <div className="contentEditor__block-page">
      <hr />
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
}
