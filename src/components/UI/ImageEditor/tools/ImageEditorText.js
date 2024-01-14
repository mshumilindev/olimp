import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import siteSettingsContext from "../../../../context/siteSettingsContext";
import classNames from "classnames";
import Form from "../../../Form/Form";
import { SwatchesPicker } from "react-color";
import Range from "../../Range/Range";

export default function ({ text, setSettingsItem }) {
  const { translate } = useContext(siteSettingsContext);
  const [showHeading, setShowHeading] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [showPosition, setShowPosition] = useState(false);
  const [showBG, setShowBG] = useState(false);
  const [showColor, setShowColor] = useState(false);

  const $heading = useRef(null);
  const $headingBtn = useRef(null);

  const $text = useRef(null);
  const $textBtn = useRef(null);

  const $btn = useRef(null);
  const $btnBtn = useRef(null);

  const $position = useRef(null);
  const $positionBtn = useRef(null);

  const $color = useRef(null);
  const $colorBtn = useRef(null);

  const $bg = useRef(null);
  const $bgBtn = useRef(null);

  const headingForm = [
    {
      type: "text",
      value: text.heading,
      id: "headingText",
      placeholder: translate("heading"),
    },
  ];

  const textForm = [
    {
      type: "textarea",
      value: text.text,
      id: "textText",
      placeholder: translate("text"),
    },
  ];

  const btnForm = [
    {
      type: "text",
      value: text.btn.text,
      id: "text",
      placeholder: translate("text"),
    },
    {
      type: "text",
      value: text.btn.link,
      id: "link",
      placeholder: translate("link"),
    },
  ];

  useEffect(() => {
    document.addEventListener("click", closeDrop);

    return () => {
      document.removeEventListener("click", closeDrop);
    };
  }, []);

  return (
    <div className="imageEditor__text">
      <div
        className={classNames("imageEditor__toolbar-btn", {
          active: text.heading,
          open: showHeading,
        })}
        onClick={() => setShowHeading(!showHeading)}
        ref={$headingBtn}
      >
        <i className="imageEditor__toolbar-btn-icon fas fa-heading" />
        <div className="imageEditor__toolbar-btn-label">
          {translate("heading")}
        </div>
      </div>
      <div
        className={classNames("imageEditor__toolbar-btn", {
          active: text.text,
          open: showText,
        })}
        onClick={() => setShowText(!showText)}
        ref={$textBtn}
      >
        <i className="imageEditor__toolbar-btn-icon fas fa-font" />
        <div className="imageEditor__toolbar-btn-label">
          {translate("text")}
        </div>
      </div>
      <div
        className={classNames("imageEditor__toolbar-btn", {
          active: text.btn.text,
          open: showBtn,
        })}
        onClick={() => setShowBtn(!showBtn)}
        ref={$btnBtn}
      >
        <i className="imageEditor__toolbar-btn-icon fas fa-link" />
        <div className="imageEditor__toolbar-btn-label">
          {translate("button")}
        </div>
      </div>
      <div
        className={classNames("imageEditor__toolbar-btn", {
          open: showPosition,
        })}
        onClick={() => setShowPosition(!showPosition)}
        ref={$positionBtn}
      >
        <i className="imageEditor__toolbar-btn-icon fas fa-th" />
        <div className="imageEditor__toolbar-btn-label">
          {translate("position")}
        </div>
      </div>
      <div
        className={classNames("imageEditor__toolbar-btn", { open: showBG })}
        onClick={() => setShowBG(!showBG)}
        ref={$bgBtn}
      >
        <i
          className="imageEditor__toolbar-btn-icon fas fa-palette"
          style={{
            color: text.bg === "transparent" ? "#fff" : text.bg,
            textShadow:
              text.bg === "transparent" ||
              text.bg === "#fff" ||
              text.bg === "#ffffff"
                ? "0 0 5px rgba(0,0,0,.25)"
                : "none",
          }}
        />
        <div className="imageEditor__toolbar-btn-label">
          {translate("background")}
        </div>
      </div>
      <div
        className={classNames("imageEditor__toolbar-btn", { open: showColor })}
        onClick={() => setShowColor(!showColor)}
        ref={$colorBtn}
      >
        <i
          className="imageEditor__toolbar-btn-icon fas fa-palette"
          style={{
            color: text.color,
            textShadow:
              text.color === "#fff" || text.color === "#ffffff"
                ? "0 0 5px rgba(0,0,0,.25)"
                : "none",
          }}
        />
        <div className="imageEditor__toolbar-btn-label">
          {translate("color")}
        </div>
      </div>
      {showHeading ? (
        <div className="imageEditor__text-heading-drop" ref={$heading}>
          <Form
            fields={headingForm}
            setFieldValue={(fieldID, value) =>
              setSettingsItem("text", {
                ...text,
                heading: value,
              })
            }
          />
        </div>
      ) : null}
      {showText ? (
        <div className="imageEditor__text-text-drop" ref={$text}>
          <Form
            fields={textForm}
            setFieldValue={(fieldID, value) =>
              setSettingsItem("text", {
                ...text,
                text: value,
              })
            }
          />
        </div>
      ) : null}
      {showBtn ? (
        <div className="imageEditor__text-btn-drop" ref={$btn}>
          <Form
            fields={btnForm}
            setFieldValue={(fieldID, value) => {
              setSettingsItem("text", {
                ...text,
                btn: {
                  ...text.btn,
                  [fieldID]: value,
                },
              });
            }}
          />
          <div className="imageEditor__text-btn-swatches">
            <div
              className={classNames("imageEditor__text-btn-swatches-item", {
                active: text.btn.style === "link",
              })}
              onClick={() => setBtnStyle("link")}
            >
              <span>{translate("button")}</span>
            </div>
            <div
              className={classNames("imageEditor__text-btn-swatches-item", {
                active: text.btn.style === "light",
              })}
              onClick={() => setBtnStyle("light")}
            >
              <span className="btn btn__light">{translate("button")}</span>
            </div>
            <div
              className={classNames("imageEditor__text-btn-swatches-item", {
                active: text.btn.style === "pale",
              })}
              onClick={() => setBtnStyle("pale")}
            >
              <span className="btn btn__pale">{translate("button")}</span>
            </div>
            <div
              className={classNames("imageEditor__text-btn-swatches-item", {
                active: text.btn.style === "dark",
              })}
              onClick={() => setBtnStyle("dark")}
            >
              <span className="btn btn__dark">{translate("button")}</span>
            </div>
            <div
              className={classNames("imageEditor__text-btn-swatches-item", {
                active: text.btn.style === "primary",
              })}
              onClick={() => setBtnStyle("primary")}
            >
              <span className="btn btn_primary">{translate("button")}</span>
            </div>
            <div
              className={classNames("imageEditor__text-btn-swatches-item", {
                active: text.btn.style === "orange",
              })}
              onClick={() => setBtnStyle("orange")}
            >
              <span className="btn btn__orange">{translate("button")}</span>
            </div>
            <div
              className={classNames("imageEditor__text-btn-swatches-item", {
                active: text.btn.style === "purple",
              })}
              onClick={() => setBtnStyle("purple")}
            >
              <span className="btn btn__purple">{translate("button")}</span>
            </div>
            <div
              className={classNames("imageEditor__text-btn-swatches-item", {
                active: text.btn.style === "success",
              })}
              onClick={() => setBtnStyle("success")}
            >
              <span className="btn btn__success">{translate("button")}</span>
            </div>
            <div
              className={classNames("imageEditor__text-btn-swatches-item", {
                active: text.btn.style === "warning",
              })}
              onClick={() => setBtnStyle("warning")}
            >
              <span className="btn btn__warning">{translate("button")}</span>
            </div>
            <div
              className={classNames("imageEditor__text-btn-swatches-item", {
                active: text.btn.style === "error",
              })}
              onClick={() => setBtnStyle("error")}
            >
              <span className="btn btn__error">{translate("button")}</span>
            </div>
          </div>
        </div>
      ) : null}
      {showPosition ? (
        <div className="imageEditor__text-position-drop" ref={$position}>
          <div
            className={classNames("imageEditor__text-position-item", {
              active: text.position.x === "left" && text.position.y === "top",
            })}
            onClick={() => setPosition("left", "top")}
          />
          <div
            className={classNames("imageEditor__text-position-item", {
              active: text.position.x === "center" && text.position.y === "top",
            })}
            onClick={() => setPosition("center", "top")}
          />
          <div
            className={classNames("imageEditor__text-position-item", {
              active: text.position.x === "right" && text.position.y === "top",
            })}
            onClick={() => setPosition("right", "top")}
          />
          <div
            className={classNames("imageEditor__text-position-item", {
              active:
                text.position.x === "left" && text.position.y === "center",
            })}
            onClick={() => setPosition("left", "center")}
          />
          <div
            className={classNames("imageEditor__text-position-item", {
              active:
                text.position.x === "center" && text.position.y === "center",
            })}
            onClick={() => setPosition("center", "center")}
          />
          <div
            className={classNames("imageEditor__text-position-item", {
              active:
                text.position.x === "right" && text.position.y === "center",
            })}
            onClick={() => setPosition("right", "center")}
          />
          <div
            className={classNames("imageEditor__text-position-item", {
              active:
                text.position.x === "left" && text.position.y === "bottom",
            })}
            onClick={() => setPosition("left", "bottom")}
          />
          <div
            className={classNames("imageEditor__text-position-item", {
              active:
                text.position.x === "center" && text.position.y === "bottom",
            })}
            onClick={() => setPosition("center", "bottom")}
          />
          <div
            className={classNames("imageEditor__text-position-item", {
              active:
                text.position.x === "right" && text.position.y === "bottom",
            })}
            onClick={() => setPosition("right", "bottom")}
          />
        </div>
      ) : null}
      {showBG ? (
        <div className="imageEditor__text-bg-drop" ref={$bg}>
          <Range
            step={10}
            min={0}
            max={100}
            activeValue={text.opacity}
            type={"text"}
            setRange={(type, value) =>
              setSettingsItem(type, { ...text, opacity: value })
            }
          />
          <SwatchesPicker
            color={text.bg}
            onChange={(value) =>
              setSettingsItem("text", { ...text, bg: value.hex })
            }
            height="100%"
            width={400}
          />
        </div>
      ) : null}
      {showColor ? (
        <div className="imageEditor__text-bg-drop" ref={$color}>
          <SwatchesPicker
            color={text.color}
            onChange={(value) =>
              setSettingsItem("text", { ...text, color: value.hex })
            }
            height="100%"
            width={400}
          />
        </div>
      ) : null}
    </div>
  );

  function closeDrop(e) {
    // === Heading
    if (
      $heading &&
      $heading.current &&
      e.target !== $heading.current &&
      !$heading.current.contains(e.target) &&
      e.target !== $headingBtn.current &&
      !$headingBtn.current.contains(e.target)
    ) {
      setShowHeading(false);
    }

    // === Text
    if (
      $text &&
      $text.current &&
      e.target !== $text.current &&
      !$text.current.contains(e.target) &&
      e.target !== $textBtn.current &&
      !$textBtn.current.contains(e.target)
    ) {
      setShowText(false);
    }

    // === Btn
    if (
      $btn &&
      $btn.current &&
      e.target !== $btn.current &&
      !$btn.current.contains(e.target) &&
      e.target !== $btnBtn.current &&
      !$btnBtn.current.contains(e.target)
    ) {
      setShowBtn(false);
    }

    // === Position
    if (
      $position &&
      $position.current &&
      e.target !== $position.current &&
      !$position.current.contains(e.target) &&
      e.target !== $positionBtn.current &&
      !$positionBtn.current.contains(e.target)
    ) {
      setShowPosition(false);
    }

    // === BG
    if (
      $bg &&
      $bg.current &&
      e.target !== $bg.current &&
      !$bg.current.contains(e.target) &&
      e.target !== $bgBtn.current &&
      !$bgBtn.current.contains(e.target)
    ) {
      setShowBG(false);
    }

    // === BG
    if (
      $color &&
      $color.current &&
      e.target !== $color.current &&
      !$color.current.contains(e.target) &&
      e.target !== $colorBtn.current &&
      !$colorBtn.current.contains(e.target)
    ) {
      setShowColor(false);
    }
  }

  function setBtnStyle(style) {
    setSettingsItem("text", {
      ...text,
      btn: {
        ...text.btn,
        style: style,
      },
    });
  }

  function setPosition(x, y) {
    setSettingsItem("text", {
      ...text,
      position: {
        x: x,
        y: y,
      },
    });
  }
}
