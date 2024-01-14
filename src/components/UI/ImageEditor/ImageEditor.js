import React, { useContext, useEffect, useRef, useState } from "react";
import Form from "../../Form/Form";
import "./imageEditor.scss";
import classNames from "classnames";
import ImageEditorSize from "./tools/ImageEditorSize";
import ImageEditorDimensions from "./tools/ImageEditorDimensions";
import ImageEditorBG from "./tools/ImageEditorBG";
import ImageEditorOverlay from "./tools/ImageEditorOverlay";
import ImageEditorBGSize from "./tools/ImageEditorBGSize";
import ImageEditorBorder from "./tools/ImageEditorBorder";
import ImageEditorText from "./tools/ImageEditorText";
import ImageEditorTransform from "./tools/ImageEditorTransform";
import ImageEditorFilters from "./tools/ImageEditorFilters";
import siteSettingsContext from "../../../context/siteSettingsContext";

export default function ImageEditor({
  id,
  image,
  settings,
  handleChange,
  setSettings,
}) {
  const { translate } = useContext(siteSettingsContext);
  const [isUsed, setIsUsed] = useState(false);
  const [originalSize, setOriginalSize] = useState(
    settings.originalSize ? settings.originalSize : { width: 0, height: 0 },
  );
  const $image = useRef(null);
  const formFields = [
    {
      type: "image",
      id: id + "_image",
      value: image,
      size: "100%",
      icon: "fa fa-image",
      customSize: true,
      noImage: true,
      label: translate("upload"),
    },
  ];

  useEffect(() => {
    if (image && $image && $image.current && !settings.originalSize) {
      setOriginalSize({
        width:
          $image.current.offsetWidth <= 800 ? $image.current.offsetWidth : 800,
        height:
          $image.current.offsetWidth <= 800
            ? $image.current.offsetHeight
            : ($image.current.offsetHeight * 800) / $image.current.offsetWidth,
      });
    }
  }, [image, settings]);

  return (
    <div
      className={classNames("imageEditor", { isUsed: isUsed, hasImage: image })}
    >
      <div className="imageEditor__shade" />
      <div className="imageEditor__holder">
        <div className="imageEditor__box">
          <div className="imageEditor__inner">
            {image && isUsed ? (
              <>
                <div className="imageEditor__toolbar">
                  <div className="imageEditor__toolbar-col">
                    <div className="imageEditor__icon">
                      <i className="fas fa-image" />
                    </div>
                    <div
                      className={classNames("imageEditor__toolbar-btn", {
                        active: !Object.keys(settings).length,
                      })}
                      onClick={resetSettings}
                    >
                      <i className="imageEditor__toolbar-btn-icon fas fa-history" />
                      <div className="imageEditor__toolbar-btn-label">
                        {translate("original_settings")}
                      </div>
                    </div>
                    <ImageEditorDimensions
                      originalDimensions={
                        settings.originalSize
                          ? settings.originalSize
                          : originalSize
                      }
                      dimensions={
                        isOriginal()
                          ? originalSize
                          : settings.dimensions
                            ? settings.dimensions
                            : "original"
                      }
                      setSettingsItem={setSettingsItem}
                    />
                    <ImageEditorTransform
                      transform={
                        settings.transform
                          ? settings.transform
                          : {
                              rotate: { x: 0, y: 0, z: 0 },
                              skew: { x: 0, y: 0 },
                            }
                      }
                      setSettingsItem={setSettingsItem}
                    />
                    <ImageEditorBGSize
                      size={settings.size}
                      setSettingsItem={setSettingsItem}
                    />
                    <ImageEditorBorder
                      border={
                        settings.border
                          ? settings.border
                          : { color: "#fff", width: 0, style: "solid" }
                      }
                      setSettingsItem={setSettingsItem}
                    />
                  </div>
                  <div className="imageEditor__toolbar-col">
                    <div
                      className="imageEditor__toolbar-btn"
                      onClick={() => setIsUsed(false)}
                    >
                      <i className="imageEditor__toolbar-btn-icon fas fa-times" />
                      <div className="imageEditor__toolbar-btn-label">
                        {translate("close")}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="imageEditor__actions">
                  <ImageEditorBG
                    bg={settings.bg ? settings.bg : "#fff"}
                    setSettingsItem={setSettingsItem}
                  />
                  <ImageEditorOverlay
                    overlay={
                      settings.overlay
                        ? settings.overlay
                        : { color: "#fff", opacity: 0, mode: "normal" }
                    }
                    setSettingsItem={setSettingsItem}
                  />
                  <ImageEditorFilters
                    image={image}
                    filters={
                      settings.filters
                        ? settings.filters
                        : {
                            blur: 0,
                            brightness: 1,
                            contrast: 1,
                            grayscale: 0,
                            "hue-rotate": 0,
                            invert: 0,
                            opacity: 1,
                            saturate: 1,
                            sepia: 0,
                            item: "normal",
                          }
                    }
                    setSettingsItem={setSettingsItem}
                  />
                </div>
                <ImageEditorSize
                  size={settings.size ? settings.size : 100}
                  setSettingsItem={setSettingsItem}
                />
                <ImageEditorText
                  text={
                    settings.text
                      ? settings.text
                      : {
                          heading: "",
                          text: "",
                          btn: { link: "", text: "", style: "link" },
                          position: { x: "center", y: "center" },
                          opacity: 100,
                          color: "#fff",
                          bg: "transparent",
                        }
                  }
                  setSettingsItem={setSettingsItem}
                />
              </>
            ) : null}
            {image ? (
              <div className="imageEditor__image-wrapper">
                {isOriginal() ? (
                  <div className="imageEditor__image-holder">
                    <img
                      src={image}
                      className="imageEditor__image"
                      ref={$image}
                      alt=""
                    />
                  </div>
                ) : (
                  <div
                    className="imageEditor__image-holder"
                    style={{
                      width: 800,
                      height: settings.dimensions
                        ? (settings.dimensions.height * 800) /
                          settings.dimensions.width
                        : originalSize.height,
                      backgroundColor: settings.bg ? settings.bg : "none",
                      border: settings.border
                        ? settings.border.width +
                          "px " +
                          settings.border.style +
                          " " +
                          settings.border.color
                        : "none",
                    }}
                  >
                    <div
                      className="imageEditor__image-bg-holder"
                      style={{
                        filter: settings.filters ? getFilters() : "none",
                      }}
                    >
                      <div
                        className={classNames("imageEditor__image-bg", {
                          [settings.filters
                            ? "imageFilter-" + settings.filters.item
                            : "imageFilter-normal"]: settings.filters,
                        })}
                        style={{
                          backgroundImage: "url(" + image + ")",
                          backgroundSize:
                            typeof settings.size === "number"
                              ? settings.size + "%"
                              : settings.size,
                          transform: settings.transform
                            ? getTransforms()
                            : "none",
                        }}
                      />
                    </div>
                    {settings.overlay ? (
                      <div
                        className="imageEditor__image-overlay"
                        style={{
                          backgroundColor: settings.overlay.color,
                          opacity: settings.overlay.opacity / 100,
                          mixBlendMode: settings.overlay.mode,
                          left: settings.border ? settings.border.width : 0,
                          right: settings.border ? settings.border.width : 0,
                          top: settings.border ? settings.border.width : 0,
                          bottom: settings.border ? settings.border.width : 0,
                        }}
                      />
                    ) : null}
                    {settings.text ? (
                      <div
                        className={
                          "imageEditor__image-text y" +
                          settings.text.position.y +
                          " x" +
                          settings.text.position.x
                        }
                        style={{
                          color: settings.text.color,
                        }}
                      >
                        <div
                          className="imageEditor__image-text-overlay"
                          style={{
                            backgroundColor: settings.text.bg,
                            opacity: settings.text.opacity / 100,
                          }}
                        />
                        {settings.text.heading ? (
                          <h2>{settings.text.heading}</h2>
                        ) : null}
                        {settings.text.text ? (
                          <p>{settings.text.text}</p>
                        ) : null}
                        {settings.text.btn.link ? (
                          <a
                            href={settings.text.btn.link}
                            target="_blank"
                            className={
                              settings.text.btn.style !== "link"
                                ? settings.text.btn.style === "primary"
                                  ? "btn btn_primary"
                                  : "btn btn__" + settings.text.btn.style
                                : null
                            }
                          >
                            {settings.text.btn.text
                              ? settings.text.btn.text
                              : settings.text.btn.link}
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ) : null}
            {!isUsed && image ? (
              <div
                className="imageEditor__open"
                onClick={() => setIsUsed(true)}
              >
                <i className="imageEditor__open-icon fas fa-pencil-alt" />
                <div className="imageEditor__open-label">
                  {translate("edit")}
                </div>
              </div>
            ) : null}
            {!isUsed ? (
              <Form
                fields={formFields}
                setFieldValue={(fieldID, value) => handleChange(fieldID, value)}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  function isOriginal() {
    return !Object.keys(settings).length;
  }

  function setSettingsItem(type, value) {
    const newParameter = {
      [type]: value,
    };

    if (type !== "dimensions" && !settings.dimensions && originalSize) {
      newParameter.dimensions = originalSize;
      newParameter.originalSize = originalSize;
    }

    setSettings({
      ...settings,
      ...newParameter,
    });
  }

  function resetSettings() {
    setSettings({});
  }

  function getTransforms() {
    let transforms = "";

    if (settings.transform.rotate) {
      if (settings.transform.rotate.z) {
        transforms += "rotateZ(" + settings.transform.rotate.z + "deg)";
      }
      if (settings.transform.rotate.x) {
        transforms += "rotateX(" + settings.transform.rotate.x + "deg)";
      }
      if (settings.transform.rotate.y) {
        transforms += "rotateY(" + settings.transform.rotate.y + "deg)";
      }
    }
    if (settings.transform.skew) {
      if (settings.transform.skew.x) {
        transforms += "skewX(" + settings.transform.skew.x + "deg)";
      }
      if (settings.transform.skew.y) {
        transforms += "skewY(" + settings.transform.skew.y + "deg)";
      }
    }

    return transforms;
  }

  function getFilters() {
    let filter = "";

    Object.keys(settings.filters).forEach((item) => {
      if (item !== "item") {
        filter += item + "(" + settings.filters[item] + ")";
      }
    });

    return filter;
  }
}
