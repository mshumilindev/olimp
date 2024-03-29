import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  memo,
  useCallback,
  useMemo,
} from "react";
import classNames from "classnames";
import ReactPlayer from "react-player";
import MathJax from "react-mathjax-preview";
import { connect } from "react-redux";
import styled from "styled-components";

import Form from "../Form/Form";
import "../UI/ImageEditor/imageEditor.scss";
import siteSettingsContext from "../../context/siteSettingsContext";
import ArticleAnswer from "./ArticleAnswer";
import Preloader from "../UI/preloader";

function Article({
  user,
  content,
  type,
  finishQuestions,
  loading,
  onBlockClick,
  answers,
  setAnswers,
  allAnswersGiven,
  setAllAnswersGiven,
  comments,
  setComments,
  readonly,
  answerMarks = [],
  handleSetAnswerMark,
}) {
  const { translate, lang } = useContext(siteSettingsContext);
  const [contentPage, setContentPage] = useState(0);
  const articleRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const getAllAnswersGiven = useCallback(() => {
    const answersBlocks = answers?.blocks?.length
      ? answers.blocks.filter((block) =>
          content.find((contentBlock) => contentBlock.id === block.id),
        )
      : answers?.blocks;

    return (
      answersBlocks?.length ===
        content?.filter((item) => item.type === "answers")?.length &&
      answersBlocks?.every(
        (block) => block.value && block.value.length && block.value[0].length,
      )
    );
  }, [answers, content]);

  const emptyAnswersCount = useMemo(() => {
    const answersBlocks = answers?.blocks?.length
      ? answers.blocks.filter((block) =>
          content.find((contentBlock) => contentBlock.id === block.id),
        )
      : answers?.blocks;
    const counter =
      content?.filter((item) => item.type === "answers")?.length -
      answersBlocks?.length;
    let tasksWording = "завдань";

    if (counter > 0 && counter < 5) {
      tasksWording = "завдання";
    }

    return !!counter
      ? `Залишилось розвʼязати ${counter} ${tasksWording}`
      : null;
  }, [answers, content]);

  useEffect(() => {
    if (answers?.blocks?.length && content?.length) {
      setAllAnswersGiven(getAllAnswersGiven());
    }
  }, [answers, content, setAllAnswersGiven, getAllAnswersGiven]);

  useEffect(() => {
    const width = articleRef.current.offsetWidth;

    setSize({
      width: width,
      height: (width * 56.25) / 100,
    });

    new ResizeObserver(handleResize).observe(articleRef.current);
  }, []);

  const pageContent = pagifyContent()[contentPage];
  let questionNumber = 0;

  return (
    <article className="article" ref={articleRef}>
      {!!answerMarks?.length && type === "testing" && (
        <div className="article__allAnswerMarks">
          {answerMarks.map(({ value }, index) => (
            <i
              key={`mark_${index}`}
              className={`fa-solid ${value === "correct" && "fa-circle-check"} ${value === "warning" && "fa-triangle-exclamation"} ${value === "incorrect" && "fa-square-xmark"}`}
            />
          ))}
        </div>
      )}
      {pageContent.map((block, index) => {
        const renderQuestionTitle =
          type === "questions" &&
          (index === 0 ||
            (content.some((item) => item.type === "comment")
              ? pageContent[index - 1]?.type === "comment"
              : pageContent[index - 1]?.type === "answers"));
        const renderQuestionTitleForTesting =
          type === "testing" &&
          (index === 0 || pageContent[index - 1]?.type === "comment");
        const currentAnswerMark = answerMarks?.find(
          (item) => item.blockID === block.id,
        )?.value;
        if (renderQuestionTitle || renderQuestionTitleForTesting) {
          questionNumber++;
        }

        return (
          <React.Fragment key={block.id}>
            {(renderQuestionTitle || renderQuestionTitleForTesting) && (
              <div className="article__title">Завдання №{questionNumber}</div>
            )}
            <div
              className={`${type === "testing" && ((pageContent[index + 1]?.type === "comment" && "article__testing-answers") || (block.type === "comment" && "article__testing-comments"))} ${currentAnswerMark}`}
            >
              {type === "testing" &&
                pageContent[index + 1]?.type === "comment" && (
                  <>
                    <div className="article__subtitle">Відповідь учня:</div>
                    <div className="article__answer-mark">
                      <i
                        className={`fa-solid fa-circle-check ${currentAnswerMark === "correct" && "active"}`}
                        onClick={handleSetAnswerMark(block.id, "correct")}
                      />
                      <i
                        className={`fa-solid fa-triangle-exclamation ${currentAnswerMark === "warning" && "active"}`}
                        onClick={handleSetAnswerMark(block.id, "warning")}
                      />
                      <i
                        className={`fa-solid fa-square-xmark ${currentAnswerMark === "incorrect" && "active"}`}
                        onClick={handleSetAnswerMark(block.id, "incorrect")}
                      />
                    </div>
                  </>
                )}
              {type === "testing" && block.type === "comment" && (
                <div className="article__subtitle">Додати коментар:</div>
              )}
              {_renderBlock(block, index)}
            </div>
          </React.Fragment>
        );
      })}
      {pagifyContent().length > 1 && type === "content"
        ? _renderPager(pagifyContent().length)
        : null}
      {loading ? (
        <div className="article__preloader">
          <Preloader />
        </div>
      ) : null}
      {type === "questions" && !readonly ? (
        <div className="article__submit-holder">
          {!!emptyAnswersCount && (
            <p className="article__submit-text">{emptyAnswersCount}</p>
          )}
          <div className="article__submit">
            <span
              className="btn btn_primary"
              onClick={finishQuestions}
              disabled={!allAnswersGiven}
            >
              {translate("submit")}
            </span>
          </div>
        </div>
      ) : null}
    </article>
  );

  function _renderPager(length) {
    return (
      <div className="pager student">
        {Array.from(Array(length)).map((num, index) => {
          return (
            <div
              className={classNames("pager__item", {
                active: contentPage === index,
              })}
              key={index}
              onClick={() => changePage(index)}
            >
              {index + 1}
            </div>
          );
        })}
      </div>
    );
  }

  function _renderBlock(block, index) {
    return (
      <div
        className={"article__block type-" + block.type}
        key={block.id}
        onClick={() => (onBlockClick ? onBlockClick(index) : null)}
      >
        {block.type === "text" || block.type === "word" ? (
          <MathJax
            math={block.value[lang] ? block.value[lang] : block.value["ua"]}
          />
        ) : null}
        {block.type === "formula" ? (
          <MathJax
            math={block.value[lang] ? block.value[lang] : block.value["ua"]}
          />
        ) : null}
        {block.type === "image" ? (
          <img src={block.value[lang]} style={{ width: "100%" }} />
        ) : null}
        {block.type === "media" ? (
          <>
            {block.value.size ? (
              <div
                className={"article__image size-" + block.value.size}
                style={{ backgroundImage: "url(" + block.value.image + ")" }}
              />
            ) : (
              <div className="imageEditor__image-wrapper">
                {isOriginal(block) ? (
                  <div className="imageEditor__image-holder">
                    <img
                      src={block.value.image}
                      className="imageEditor__image"
                    />
                  </div>
                ) : (
                  <div
                    className="imageEditor__image-holder"
                    style={{
                      width: size.width,
                      height: block.value.settings.dimensions
                        ? (block.value.settings.dimensions.height *
                            size.width) /
                          block.value.settings.dimensions.width
                        : block.value.settings.originalSize.height,
                      backgroundColor: block.value.settings.bg
                        ? block.value.settings.bg
                        : "none",
                      border: block.value.settings.border
                        ? block.value.settings.border.width +
                          "px " +
                          block.value.settings.border.style +
                          " " +
                          block.value.settings.border.color
                        : "none",
                    }}
                  >
                    <div
                      className="imageEditor__image-bg-holder"
                      style={{
                        filter: block.value.settings.filters
                          ? getFilters(block)
                          : "none",
                      }}
                    >
                      <div
                        className={classNames("imageEditor__image-bg", {
                          [block.value.settings.filters
                            ? "imageFilter-" + block.value.settings.filters.item
                            : "imageFilter-normal"]:
                            block.value.settings.filters,
                        })}
                        style={{
                          backgroundImage: "url(" + block.value.image + ")",
                          backgroundSize:
                            typeof block.value.settings.size === "number"
                              ? block.value.settings.size + "%"
                              : block.value.settings.size,
                          transform: block.value.settings.transform
                            ? getTransforms(block)
                            : "none",
                        }}
                      />
                    </div>
                    {block.value.settings.overlay ? (
                      <div
                        className="imageEditor__image-overlay"
                        style={{
                          backgroundColor: block.value.settings.overlay.color,
                          opacity: block.value.settings.overlay.opacity / 100,
                          mixBlendMode: block.value.settings.overlay.mode,
                          left: block.value.settings.border
                            ? block.value.settings.border.width
                            : 0,
                          right: block.value.settings.border
                            ? block.value.settings.border.width
                            : 0,
                          top: block.value.settings.border
                            ? block.value.settings.border.width
                            : 0,
                          bottom: block.value.settings.border
                            ? block.value.settings.border.width
                            : 0,
                        }}
                      />
                    ) : null}
                    {block.value.settings.text ? (
                      <div
                        className={
                          "imageEditor__image-text y" +
                          block.value.settings.text.position.y +
                          " x" +
                          block.value.settings.text.position.x
                        }
                        style={{
                          color: block.value.settings.text.color,
                        }}
                      >
                        <div
                          className="imageEditor__image-text-overlay"
                          style={{
                            backgroundColor: block.value.settings.text.bg,
                            opacity: block.value.settings.text.opacity / 100,
                          }}
                        />
                        {block.value.settings.text.heading ? (
                          <h2>{block.value.settings.text.heading}</h2>
                        ) : null}
                        {block.value.settings.text.text ? (
                          <p>{block.value.settings.text.text}</p>
                        ) : null}
                        {block.value.settings.text.btn.link ? (
                          <a
                            href={block.value.settings.text.btn.link}
                            target="_blank"
                            className={
                              block.value.settings.text.btn.style !== "link"
                                ? block.value.settings.text.btn.style ===
                                  "primary"
                                  ? "btn btn_primary"
                                  : "btn btn__" +
                                    block.value.settings.text.btn.style
                                : null
                            }
                          >
                            {block.value.settings.text.btn.text
                              ? block.value.settings.text.btn.text
                              : block.value.settings.text.btn.link}
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}
            {block.value.caption[lang] || block.value.caption["ua"] ? (
              <div className="article__image-caption">
                {block.value.caption[lang]
                  ? block.value.caption[lang]
                  : block.value.caption["ua"]}
              </div>
            ) : null}
          </>
        ) : null}
        {block.type === "youtube" ? (
          <>
            {block.value ? (
              <div className="youtube-holder">
                <ReactPlayer url={block.value} />
              </div>
            ) : null}
          </>
        ) : null}
        {block.type === "audio" && block.value.url ? (
          <div className={"article__audio"}>
            {block.value.caption ? <p>{block.value.caption}</p> : null}
            <audio controls>
              <source src={getPlayLink(block.value.url)} />
            </audio>
          </div>
        ) : null}
        {block.type === "video" && block.value.url ? (
          <div className={"article__audio"}>
            {block.value.caption ? <p>{block.value.caption}</p> : null}
            <div className="article__video-holder">
              <iframe
                src={getPlayVideoLink(block.value.url)}
                allowFullScreen
                frameBorder
              />
            </div>
          </div>
        ) : null}
        {block.type === "googleWord" ? (
          <iframe
            src={getWordURL(block.value)}
            style={{
              width: "100%",
              height: (size.width * 141) / 100,
              border: "1px solid grey",
            }}
            frameBorder="0"
            allowFullScreen={true}
            mozAllowFullScreen={true}
            webkitAllowFullscreen={true}
          />
        ) : null}
        {block.type === "googleExcel" ? (
          <iframe
            src={getExcelURL(block.value)}
            style={{
              width: "100%",
              height: (size.width * 141) / 100,
              border: "1px solid grey",
            }}
            frameBorder="0"
            allowFullScreen={true}
            mozAllowFullScreen={true}
            webkitAllowFullscreen={true}
          />
        ) : null}
        {block.type === "googlePowerpoint" ? (
          <iframe
            src={getPowerpointURL(block.value)}
            style={{ width: "100%", height: size.height }}
            frameBorder="0"
            allowFullScreen={true}
            mozAllowFullScreen={true}
            webkitAllowFullscreen={true}
          />
        ) : null}
        {block.type === "iframe" ? (
          <BlockStyled>
            <Preloader />
            <iframe
              src={block.value}
              style={{ width: "100%", height: size.height }}
              frameBorder="0"
              allowFullScreen={true}
              mozAllowFullScreen={true}
              webkitAllowFullscreen={true}
            />
          </BlockStyled>
        ) : null}
        {block.type === "divider" ? <hr /> : null}
        {block.type === "answers" ? (
          <ArticleAnswer
            block={block}
            answers={answers}
            setContentPage={setContentPage}
            setAnswer={setAnswer}
            readonly={readonly}
            answerMarks={answerMarks}
          />
        ) : null}
        {block.type === "comment" ? (
          user.role === "teacher" ? (
            <Form
              fields={[
                {
                  type: "editor",
                  id: block.id,
                  placeholder: translate("add_comment"),
                  initialValue: block.initialValue,
                },
              ]}
              setFieldValue={setComment}
            />
          ) : block.value ? (
            <div className="article__comment">
              <div className="article__comment-heading">
                {`${translate("comment_from_teacher")}:`}
              </div>
              <div dangerouslySetInnerHTML={{ __html: block.value }} />
            </div>
          ) : null
        ) : null}
      </div>
    );
  }

  function getWordURL(url) {
    let newURL = url;

    if (newURL.length) {
      newURL = newURL +=
        "?embedded=true&widget=false&headers=false&chrome=false";
    }

    return newURL;
  }

  function getExcelURL(url) {
    let newURL = url;

    if (newURL.length) {
      newURL = newURL +=
        "?embedded=true&widget=false&headers=false&chrome=false";
    }

    return newURL;
  }

  function getPowerpointURL(url) {
    let newURL = url;

    if (newURL.length) {
      newURL = newURL.replace("/pub?", "/embed?");
    }
    return newURL;
  }

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

  function getPlayVideoLink(url) {
    return (
      url.replace(
        "https://drive.google.com/open?id=",
        "https://drive.google.com/file/d/",
      ) + "/preview"
    );
  }

  function changePage(index) {
    if (index !== contentPage) {
      window.scrollTo({
        top: 0,
        left: 0,
      });
      setContentPage(index);
    }
  }

  function pagifyContent() {
    const pages = [];
    let pageI = 0;
    const sortedContent = content.sort((a, b) => a.index - b.index);

    Array.from(
      Array(sortedContent.filter((item) => item.type === "page").length + 1),
    ).forEach((page, index) => {
      let isPage = false;
      pages[index] = [];

      sortedContent.forEach((block, blockIndex) => {
        if (blockIndex >= pageI) {
          if (block.type === "page" && !isPage) {
            isPage = true;
            pageI = blockIndex + 1;
          }
          if (!isPage) {
            pages[index].push(block);
          }
        }
      });
      isPage = false;
    });

    return pages;
  }

  function setAnswer(blockID, value) {
    if (answers.blocks.find((block) => block.id === blockID)) {
      answers.blocks.find((block) => block.id === blockID).value = value;
    } else {
      answers.blocks.push({
        id: blockID,
        value: value,
      });
    }
    setAnswers(Object.assign({}, answers));

    if (type === "questions") {
      setAllAnswersGiven(getAllAnswersGiven());
    }
  }

  function setComment(fieldID, value) {
    const newComments = comments;

    newComments.find((item) => item.id === fieldID).value = value;

    setComments(Object.assign([], newComments));
  }

  function isOriginal(block) {
    return !Object.keys(block.value.settings).length;
  }

  function getTransforms(block) {
    let transforms = "";

    if (block.value.settings.transform.rotate) {
      if (block.value.settings.transform.rotate.z) {
        transforms +=
          "rotateZ(" + block.value.settings.transform.rotate.z + "deg)";
      }
      if (block.value.settings.transform.rotate.x) {
        transforms +=
          "rotateX(" + block.value.settings.transform.rotate.x + "deg)";
      }
      if (block.value.settings.transform.rotate.y) {
        transforms +=
          "rotateY(" + block.value.settings.transform.rotate.y + "deg)";
      }
    }
    if (block.value.settings.transform.skew) {
      if (block.value.settings.transform.skew.x) {
        transforms += "skewX(" + block.value.settings.transform.skew.x + "deg)";
      }
      if (block.value.settings.transform.skew.y) {
        transforms += "skewY(" + block.value.settings.transform.skew.y + "deg)";
      }
    }

    return transforms;
  }

  function getFilters(block) {
    let filter = "";

    Object.keys(block.value.settings.filters).forEach((item) => {
      filter += item + "(" + block.value.settings.filters[item] + ")";
    });

    return filter;
  }

  function handleResize() {
    if (articleRef && articleRef.current) {
      const width = articleRef.current.offsetWidth;

      setSize({
        width: width,
        height: (width * 56.25) / 100,
      });
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.currentUser,
  };
};

export default connect(mapStateToProps)(memo(Article));

const BlockStyled = styled.div`
  position: relative;

  iframe {
    position: relative;
    z-index: 1;
  }

  .preloader {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;
