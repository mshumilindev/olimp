import React, {
  useContext,
  useState,
  memo,
  useEffect,
  useCallback,
} from "react";
import Form from "../Form/Form";
import siteSettingsContext from "../../context/siteSettingsContext";
import classNames from "classnames";

function ArticleAnswer({ block, setAnswer, answers, readonly, answerMarks }) {
  const { translate, lang } = useContext(siteSettingsContext);
  const correctAnswers = block.value.correctAnswers.split(", ");
  const [formFields, setFormFields] = useState(null);

  useEffect(() => {
    if (block.value.type === "text" || block.value.type === "formula") {
      setFormFields([
        {
          id: block.id,
          type: block.value.type === "text" ? "editor" : block.value.type,
          name: translate("answer"),
          value: checkForSavedAnswer()[0] || "",
          initialValue: checkForSavedAnswer()[0] || "",
        },
      ]);
    } else if (block.value.type === "image") {
      setFormFields([
        {
          id: block.id,
          type: "image",
          name: translate("answer"),
          value: checkForSavedAnswer()[0] || "",
          initialValue: checkForSavedAnswer()[0] || "",
          size: "100%",
          customSize: "50px",
          icon: "fas fa-image",
          saveSize: 500,
        },
      ]);
    } else {
      if (correctAnswers.length === 1) {
        setFormFields([
          {
            id: block.id,
            type: "radio",
            value: checkForSavedAnswer()[0] || "",
            variant: "alt",
            name: translate("answer"),
            options: block.value.answers.map((answer, index) => {
              return {
                id: index,
                name: answer[lang] || answer["ua"],
              };
            }),
            noTitle: true,
          },
        ]);
      } else {
        setFormFields([
          {
            id: block.id,
            variant: "alt",
            type: "checkboxes",
            name: translate("answer"),
            value: checkForSavedAnswer() || "",
            options: block.value.answers.map((answer, index) => {
              return {
                id: index,
                name: answer[lang] || answer["ua"],
              };
            }),
            noTitle: true,
          },
        ]);
      }
    }
  }, [block]);

  const setFieldValue = useCallback(
    (fieldID, value) => {
      const currentFields = [...formFields];
      const newAnswer = answers.blocks.find((item) => item.id === block.id);

      if (newAnswer) {
        if (correctAnswers.length === 1) {
          setAnswer(fieldID, [value]);
        } else {
          if (newAnswer.value.indexOf(value) !== -1) {
            setAnswer(
              fieldID,
              newAnswer.value.filter((item) => item !== value),
            );
          } else {
            setAnswer(fieldID, [...newAnswer.value, value]);
          }
        }
      } else {
        setAnswer(fieldID, [value]);
      }

      if (correctAnswers.length === 1) {
        currentFields[0].value = value;
      } else {
        if (currentFields[0].value.indexOf(value) !== -1) {
          currentFields[0].value.splice(
            currentFields[0].value.indexOf(value),
            1,
          );
        } else {
          currentFields[0].value.push(value);
        }
      }

      setFormFields(currentFields);
    },
    [formFields, answers],
  );

  return (
    <div
      className={classNames("article__answers", {
        isReadonly: readonly,
        correct: answerMarks.some(
          ({ blockID, value }) => blockID === block.id && value === "correct",
        ),
        warning: answerMarks.some(
          ({ blockID, value }) => blockID === block.id && value === "warning",
        ),
        incorrect: answerMarks.some(
          ({ blockID, value }) => blockID === block.id && value === "incorrect",
        ),
      })}
    >
      <div className="article__answers-mark">
        {!!answerMarks.find(({ blockID, value }) => blockID === block.id) && (
          <>
            {answerMarks.find(({ blockID, value }) => blockID === block.id)
              .value === "correct" && (
              <i className="fa-solid fa-circle-check" />
            )}
            {answerMarks.find(({ blockID, value }) => blockID === block.id)
              .value === "warning" && (
              <i className="fa-solid fa-triangle-exclamation" />
            )}
            {answerMarks.find(({ blockID, value }) => blockID === block.id)
              .value === "incorrect" && (
              <i className="fa-solid fa-square-xmark" />
            )}
          </>
        )}
      </div>
      {formFields ? (
        (block.value.type === "text" ||
          block.value.type === "formula" ||
          block.value.type === "image") &&
        readonly &&
        !checkForSavedAnswer()[0] ? (
          <div className="article__block-placeholder">
            {block.value.type === "image"
              ? "Учень зможе завантажити зображення"
              : translate("text_will_be_shown")}
          </div>
        ) : (
          <>
            {block.value.type === "text" && (
              <div className="article__answerTitle">
                Відповідь <span>(потрібно ввести текст)</span>:
              </div>
            )}
            {block.value.type === "formula" && (
              <div className="article__answerTitle">
                Відповідь <span>(потрібно ввести текст)</span>:
              </div>
            )}
            {block.value.type === "image" && (
              <div className="article__answerTitle">
                Відповідь <span>(потрібно завантажити зображення)</span>:
              </div>
            )}
            {block.value.type === "multiple_choice" &&
              (block.value.correctAnswers.split(",").length > 1 ? (
                <div className="article__answerTitle">
                  Відповідь{" "}
                  <span>(потрібно обрати один, або більше варіантів)</span>:
                </div>
              ) : (
                <div className="article__answerTitle">
                  Відповідь <span>(потрібно обрати один з варіантів)</span>:
                </div>
              ))}
            <Form fields={formFields} setFieldValue={setFieldValue} />
          </>
        )
      ) : null}
    </div>
  );

  function checkForSavedAnswer() {
    if (answers && answers.blocks.find((item) => item.id === block.id)) {
      return answers.blocks.find((item) => item.id === block.id).value;
    }
    return [];
  }
}

export default memo(ArticleAnswer);
