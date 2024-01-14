import React, { useContext, useState } from "react";
import siteSettingsContext from "../../../context/siteSettingsContext";
import classNames from "classnames";
import * as blocksJSON from "./blocks";
import * as typeBlocksJSON from "./typeBlocks";
import SeamlessEditorPreview from "./SeamlessEditorPreview";
import { Scrollbars } from "react-custom-scrollbars";
import { Editor } from "@tinymce/tinymce-react";
import SeamlessEditorText from "./blocks/SeamlessEditorText";
import SeamlessEditorImage from "./blocks/SeamlessEditorImage";
import SeamlessEditorAudio from "./blocks/SeamlessEditorAudio";
import SeamlessEditorVideo from "./blocks/SeamlessEditorVideo";
import SeamlessEditorYoutube from "./blocks/SeamlessEditorYoutube";
import SeamlessEditorDivider from "./blocks/SeamlessEditorDivider";
import SeamlessEditorGoogleWord from "./blocks/SeamlessEditorGoogleWord";
import SeamlessEditorGoogleExcel from "./blocks/SeamlessEditorGoogleExcel";
import SeamlessEditorGooglePowerpoint from "./blocks/SeamlessEditorGooglePowerpoint";
import SeamlessEditorWord from "./blocks/SeamlessEditorWord";
import SeamlessEditorExcel from "./blocks/SeamlessEditorExcel";
import SeamlessEditorIframe from "./blocks/SeamlessEditorIframe";
import SeamlessEditorQuestion from "./blocks/SeamlessEditorQuestion/SeamlessEditorQuestion";

const blocksData = blocksJSON.default;
const typeBlocks = typeBlocksJSON.default;

export default function SeamlessEditorEditor({
  title,
  types,
  type,
  addBlock,
  setBlock,
  removeBlock,
  moveBlock,
  content,
  scrollToBlock,
  setIsEdited,
}) {
  const { translate, lang } = useContext(siteSettingsContext);
  const [showType, setShowType] = useState(null);
  const [dragBlock, setDragBlock] = useState(null);
  const [dragOverBlock, setDragOverBlock] = useState(null);
  const [dragOverBlockPosition, setDragOverBlockPosition] = useState(null);
  const [textEditorValue, setTextEditorValue] = useState("");
  const [dragOverNew, setDragOverNew] = useState(false);
  const availableTypes = [
    {
      icon: "fas fa-font",
      type: "text",
    },
    {
      icon: "fas fa-images",
      type: "media",
    },
    {
      icon: "fas fa-file",
      type: "document",
    },
    {
      icon: "fab fa-google-drive",
      type: "googleDrive",
    },
    {
      icon: "fas fa-question",
      type: "answers",
    },
    {
      icon: "fas fa-infinity",
      type: "other",
    },
  ];

  return (
    <div className="seamlessEditor__editor">
      <div className="seamlessEditor__editor-header">
        {_renderTitle()}
        {_renderActions()}
      </div>
      <div className="seamlessEditor__editor-body">
        {_renderTypes()}
        {_renderBlocks()}
        {content.length ? (
          <SeamlessEditorPreview
            content={content}
            scrollToBlock={scrollToBlock}
            moveBlock={moveBlock}
            removeBlock={removeBlock}
          />
        ) : null}
      </div>
    </div>
  );

  function _renderActions() {
    return (
      <div className="seamlessEditor__editor-actions">
        <div className="seamlessEditor__editor-actions-item">
          <div
            className="seamlessEditor__editor-btn"
            onClick={() => setIsEdited(false)}
          >
            <i className="fas fa-times" />
            {translate("close")}
          </div>
        </div>
      </div>
    );
  }

  function _renderTypes() {
    return (
      <>
        <div className="seamlessEditor__editor-types">
          {Object.keys(types).map((key) =>
            _renderType(availableTypes.find((item) => item.type === key)),
          )}
        </div>
        {showType ? _renderTypeBlocks() : null}
      </>
    );
  }

  function _renderType(item) {
    return (
      <div
        className="seamlessEditor__editor-types-item"
        key={"type" + item.type}
      >
        <div
          className={classNames("seamlessEditor__editor-btn", {
            active: showType === item.type,
          })}
          onClick={() => setShowType(showType === item.type ? null : item.type)}
        >
          <i className={item.icon} />
          {translate(item.type)}
        </div>
      </div>
    );
  }

  function _renderTypeBlocks() {
    return (
      <div className="seamlessEditor__editor-type">
        {types[showType].map((type) =>
          _renderTypeBlock(
            typeBlocks[showType].find((item) => item.block === type),
          ),
        )}
      </div>
    );
  }

  function _renderTypeBlock(item) {
    return (
      <div
        className="seamlessEditor__editor-type-item"
        key={"typeBlock" + item.block}
        draggable
        onDragStart={() => setDragBlock(item.block)}
        onDragEnd={handleDragEnd}
      >
        <div
          className="seamlessEditor__editor-btn"
          onClick={() => addBlock(getNewBlock(item.block), content.length)}
        >
          <i className={item.icon} />
          {translate(item.block)}
        </div>
      </div>
    );
  }

  function _renderTitle() {
    return (
      <div className="seamlessEditor__editor-title">
        <i className="content_title-icon fa fa-paragraph" />
        <div className="seamlessEditor__editor-title-inner">
          {title}
          <span>{translate(type)}</span>
        </div>
      </div>
    );
  }

  function _renderBlocks() {
    return (
      <div className="seamlessEditor__editor-blocks-holder">
        <Scrollbars
          autoHeight
          hideTracksWhenNotNeeded
          autoHeightMax={"100%"}
          renderTrackVertical={(props) => (
            <div {...props} className="scrollbar__track" />
          )}
          renderView={(props) => (
            <div {...props} className="scrollbar__content" />
          )}
        >
          <div className="seamlessEditor__editor-blocks-inner">
            <div className="seamlessEditor__editor-blocks">
              {!content.length
                ? _renderNewBlock()
                : content.map((item, index) => _renderBlock(item, index))}
            </div>
          </div>
        </Scrollbars>
        {textEditorValue ? _renderTextEditor() : null}
      </div>
    );
  }

  function _renderNewBlock() {
    return (
      <div
        className={classNames("seamlessEditor__editor-block isNew", {
          isOver: dragOverNew,
        })}
        onDragLeave={() =>
          setTimeout(() => {
            setDragOverNew(false);
          }, 0)
        }
        onDragEnter={() => setDragOverNew(true)}
      >
        <div className="seamlessEditor__editor-block-inner">
          Почніть додавати блоки
        </div>
      </div>
    );
  }

  function _renderBlock(item, index) {
    return (
      <div
        className="seamlessEditor__editor-block-holder"
        onDragEnter={() => setDragOverBlock(item.id)}
        key={"block" + item.id}
        id={"block" + item.id}
      >
        {dragBlock && index === 0 ? _renderDropArea(item.id, "before") : null}
        <div className="seamlessEditor__editor-block">
          <div className="seamlessEditor__editor-block-inner">
            <div className="seamlessEditor__editor-block-type">
              <i className={"content_title-icon " + getType(item.type).icon} />
              {translate(getType(item.type).block)}
            </div>
            {getBlock(item)}
          </div>
        </div>
        {dragBlock ? _renderDropArea(item.id, "after") : null}
      </div>
    );
  }

  function _renderDropArea(blockID, position) {
    return (
      <div
        className={classNames("seamlessEditor__editor-block dropArea", {
          isOver:
            dragOverBlock === blockID && dragOverBlockPosition === position,
        })}
        onDragLeave={() =>
          setTimeout(() => {
            setDragOverBlockPosition(null);
          }, 0)
        }
        onDragEnter={() => setDragOverBlockPosition(position)}
      >
        <div className="seamlessEditor__editor-block-inner">
          {translate("drop_block_here")}
        </div>
      </div>
    );
  }

  function _renderTextEditor() {
    const editorToolbar = [
      "fullscreen | undo redo | formatselect | forecolor | fontselect | fontsizeselect | numlist bullist | align | bold italic underline strikeThrough subscript superscript | table tabledelete tableprops tablerowprops tablecellprops tableinsertrowbefore tableinsertrowafter tabledeleterow tableinsertcolbefore tableinsertcolafter tabledeletecol | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry",
    ];

    const editorConfig = {
      menubar: false,
      language: "uk",
      max_height: 300,
      plugins: [
        "autoresize fullscreen",
        "advlist lists image charmap anchor",
        "visualblocks",
        "paste",
        "table",
      ],
      // external_plugins: {
      //   tiny_mce_wiris:
      //     "https://cdn.jsdelivr.net/npm/@wiris/mathtype-tinymce4@7.29.0/plugin.min.js",
      // },
      paste_word_valid_elements:
        "b,strong,i,em,h1,h2,u,p,ol,ul,li,a[href],span,color,font-size,font-color,font-family,mark,table,tr,td",
      paste_retain_style_properties: "all",
      fontsize_formats: "8 9 10 11 12 14 16 18 20 22 24 26 28 36 48 72",
      toolbar: editorToolbar,
      placeholder: translate("enter_text"),
    };

    return (
      <div className="seamlessEditor__textEditor-holder">
        <div className="seamlessEditor__textEditor-box">
          <div className="seamlessEditor__textEditor">
            <Editor
              value={textEditorValue.value[lang]}
              onEditorChange={textEditorChange}
              init={editorConfig}
              apiKey="5wvj56289tu06v7tziccawdyxaqxkmsxzzlrh6z0aia0pm8y"
            />
          </div>
          <div
            className="seamlessEditor__textEditor-close"
            onClick={() => setTextEditorValue(null)}
          >
            <i className="fas fa-check" />
          </div>
        </div>
      </div>
    );
  }

  function textEditorChange(value) {
    textEditorValue.value[lang] = value;
    setBlock(textEditorValue);
  }

  function getBlock(block) {
    switch (block.type) {
      // === Text
      case "text":
      case "formula":
        return (
          <SeamlessEditorText block={block} openTextEditor={openTextEditor} />
        );

      // === Media
      case "media":
        return <SeamlessEditorImage block={block} setBlock={setBlock} />;

      case "audio":
        return <SeamlessEditorAudio block={block} setBlock={setBlock} />;

      case "video":
        return <SeamlessEditorVideo block={block} setBlock={setBlock} />;

      case "youtube":
        return <SeamlessEditorYoutube block={block} setBlock={setBlock} />;

      // === Document
      case "word":
        return (
          <SeamlessEditorWord
            block={block}
            setBlock={setBlock}
            openTextEditor={openTextEditor}
          />
        );

      // === Document
      case "excel":
        return <SeamlessEditorExcel block={block} setBlock={setBlock} />;

      // === Document
      case "iframe":
        return <SeamlessEditorIframe block={block} setBlock={setBlock} />;

      // === Google Drive
      case "googleWord":
        return <SeamlessEditorGoogleWord block={block} setBlock={setBlock} />;

      case "googleExcel":
        return <SeamlessEditorGoogleExcel block={block} setBlock={setBlock} />;

      case "googlePowerpoint":
        return (
          <SeamlessEditorGooglePowerpoint block={block} setBlock={setBlock} />
        );

      case "answers":
        return <SeamlessEditorQuestion block={block} setBlock={setBlock} />;

      // === Other
      case "divider":
        return <SeamlessEditorDivider />;
    }
  }

  function handleDragEnd() {
    if (dragOverNew) {
      addBlock(getNewBlock(dragBlock), 0);
    } else {
      if (dragBlock && dragOverBlock && dragOverBlockPosition) {
        const index = content.indexOf(
          content.find((item) => item.id === dragOverBlock),
        );
        let newPosition = null;

        if (dragOverBlockPosition === "before") {
          if (index === 0) {
            newPosition = 0;
          } else {
            newPosition = index - 1;
          }
        } else {
          if (index === content.length - 1) {
            newPosition = content.length;
          } else {
            newPosition = index + 1;
          }
        }

        addBlock(getNewBlock(dragBlock), newPosition);
      }
    }
    setDragBlock(null);
    setDragOverBlock(null);
    setDragOverBlockPosition(null);
    setDragOverNew(false);
  }

  function getNewBlock(type) {
    return JSON.parse(JSON.stringify(blocksData[type]));
  }

  function openTextEditor(block) {
    setTextEditorValue(Object.assign({}, block));
  }

  function getType(itemType) {
    let type = null;

    Object.keys(typeBlocks).forEach((key) => {
      let parsedType = itemType;

      if (itemType === "media") {
        parsedType = "image";
      }
      if (itemType === "formula") {
        parsedType = "text";
      }

      if (typeBlocks[key].find((item) => item.block === parsedType)) {
        type = typeBlocks[key].find((item) => item.block === parsedType);
      }
    });

    return type;
  }
}
