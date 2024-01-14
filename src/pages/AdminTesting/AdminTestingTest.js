import React, { useCallback, useContext, useEffect, useState } from "react";
import { orderBy } from "natural-orderby";
import { connect } from "react-redux";
import styled from "styled-components";

import Modal from "../../components/UI/Modal/Modal";
import Preloader from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import Article from "../../components/Article/Article";
import Form from "../../components/Form/Form";
import { updateTest, deleteTest } from "../../redux/actions/testsActions";
import Confirm from "../../components/UI/Confirm/Confirm";
import { useNavigate } from "react-router-dom";
import { db } from "../../db/firestore";
import { collection, getDocs } from "firebase/firestore"; 

const AdminTestingTest = ({
  test,
  userItem,
  lesson,
  updateTest,
  deleteTest,
  testID,
}) => {
  const navigate = useNavigate();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { translate, lang } = useContext(siteSettingsContext);

  const [showModal, setShowModal] = useState(false);
  const [lessonQA, setLessonQA] = useState(null);
  const [score, setScore] = useState(test.score);
  const [comments, setComments] = useState(
    test.comments ||
      test.blocks.map((item) => {
        return {
          id: "comment_" + item.id,
          value: "",
        };
      }),
  );

  const [answerMarks, setAnswerMarks] = useState([]);

  const handleSetAnswerMark = useCallback(
    (blockID, value) => () => {
      if (answerMarks.find((item) => item.blockID === blockID)) {
        return setAnswerMarks(
          answerMarks.map((item) => {
            return item.blockID === blockID
              ? {
                  ...item,
                  value,
                }
              : item;
          }),
        );
      }

      return setAnswerMarks([
        ...answerMarks,
        {
          blockID,
          value,
        },
      ]);
    },
    [answerMarks],
  );

  useEffect(() => {
    if (showModal && !lessonQA) {
      const QARef = collection(db, 'courses', test.lesson.subjectID, 'coursesList', test.lesson.courseID, 'modules', test.lesson.moduleID, 'lessons', test.lesson.lessonID, 'QA');

      getDocs(QARef).then((snapshot) => {
        const QA = [];

        if (snapshot.docs.length) {
          snapshot.docs.forEach((doc) => {
            QA.push({
              ...doc.data(),
              id: doc.id,
            });
          });
        }
        setLessonQA(orderBy(QA, (v) => v.index));
      });
    }
  }, [showModal, setLessonQA, lessonQA, test]);

  useEffect(() => {
    if (testID && testID === test?.id) {
      setShowModal(true);
    }
  }, [test, testID]);

  const reworkQA = useCallback(() => {
    const newQA = [];
    const newMarks = [];

    lessonQA.forEach((item) => {
      if (item.type !== "answers") {
        newQA.push(item);
      } else {
        const currentComment = comments.find(
          (comItem) => comItem.id === "comment_" + item.id,
        );
        const type =
          item.value.type === "formula"
            ? "formula"
            : item.value.type === "image"
              ? "image"
              : "text";

        if (currentComment) {
          newQA.push(
            {
              ...item,
              type: type,
              value: {
                ua: test.blocks
                  .find((block) => block.id === item.id)
                  .value.join(", "),
              },
            },
            {
              type: "comment",
              id: currentComment.id,
              initialValue: currentComment.value,
            },
          );
          if (test.blocks.find((block) => block.id === item.id).mark) {
            newMarks.push({
              blockID: test.blocks.find((block) => block.id === item.id).id,
              value: test.blocks.find((block) => block.id === item.id).mark,
            });
          }
        }
      }
    });

    if (!!newMarks.length && !answerMarks.length) {
      setAnswerMarks(newMarks);
    }

    return newQA;
  }, [lessonQA, comments, test, answerMarks]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    navigate("/admin-tests");
  }, [navigate]);

  const handleSetScore = useCallback(() => {
    updateTest({
      ...test,
      blocks: test.blocks.map((block) => {
        if (answerMarks.find((mark) => mark.blockID === block.id)) {
          return {
            ...block,
            mark: answerMarks.find((mark) => mark.blockID === block.id).value,
          };
        }

        return block;
      }),
      comments: comments,
      score: score || "",
    });
    handleCloseModal();
  }, [updateTest, setShowModal, comments, test, score, answerMarks]);

  const handleDeleteTest = useCallback(() => {
    setShowConfirmDelete(false);

    const savedTests = localStorage.getItem("savedTests")
      ? JSON.parse(localStorage.getItem("savedTests"))
      : [];
    localStorage.setItem(
      "savedTests",
      JSON.stringify(savedTests.filter((item) => item !== test.id)),
    );

    deleteTest(test.id);
  }, [setShowConfirmDelete, deleteTest, test]);

  return (
    <AdminTestingTestStyled isSaved={!test.isSent}>
      <AdminTestingDeleteTestStyled
        onClick={test.isSent ? () => setShowConfirmDelete(true) : null}
        isDisabled={!test.isSent}
      >
        <i className="fa fa-trash-alt" />
      </AdminTestingDeleteTestStyled>
      <AdminTestingTestInnerStyled
        isSaved={!test.isSent}
        onClick={() => setShowModal(true)}
      >
        {test.isSent ? (
          test.score ? (
            <AdminTestingIconStyled hasScore>
              {test.score}
            </AdminTestingIconStyled>
          ) : (
            <AdminTestingIconStyled>
              <i className="fa fa-hourglass-half" />
            </AdminTestingIconStyled>
          )
        ) : (
          <AdminTestingIconStyled>
            <i className="fa-solid fa-floppy-disk" />
          </AdminTestingIconStyled>
        )}
        <AdminTestingTextStyled>{userItem.name}</AdminTestingTextStyled>
      </AdminTestingTestInnerStyled>
      {userItem && showModal ? (
        <Modal
          onHideModal={handleCloseModal}
          heading={`<span>${lesson.name[lang] ? lesson.name[lang] : lesson.name["ua"]} / </span>${translate("test_qa_for")} ${userItem ? userItem.name : "Такого учня у школі більше немає"}`}
        >
          {lessonQA ? (
            <>
              <Article
                content={reworkQA(lessonQA)}
                comments={comments}
                setComments={setComments}
                type="testing"
                handleSetAnswerMark={handleSetAnswerMark}
                answerMarks={answerMarks}
              />
              <hr />
              <Form
                fields={[
                  {
                    type: "text",
                    placeholder: "score",
                    id: "score",
                    value: score,
                  },
                ]}
                setFieldValue={(fieldID, value) => setScore(value)}
              />
              <div className="adminTesting__btnScore">
                <span className="btn btn_primary" onClick={handleSetScore}>
                  {translate("set_score")}
                </span>
              </div>
            </>
          ) : (
            <Preloader />
          )}
        </Modal>
      ) : null}
      {showConfirmDelete ? (
        <Confirm
          message={translate("sure_to_delete_test")}
          cancelAction={() => setShowConfirmDelete(false)}
          confirmAction={handleDeleteTest}
        />
      ) : null}
    </AdminTestingTestStyled>
  );
}

const mapDispatchToProps = (dispatch) => ({
  updateTest: (newTest) => dispatch(updateTest(newTest)),
  deleteTest: (testID) => dispatch(deleteTest(testID)),
});

export default connect(null, mapDispatchToProps)(AdminTestingTest);

const AdminTestingTestStyled = styled.div`
  position: relative;

  &:nth-child(2n + 1) {
    background: #fafafa;
  }

  ${({ isSaved }) =>
    isSaved &&
    `
  opacity: .5;
  `}

  .modal__box {
    max-width: 860px;
  }
`;

const AdminTestingTestInnerStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;

  ${({ isSaved }) =>
    !isSaved &&
    `
  &:hover {
  cursor: pointer;
  background: #4ec1e2;
  color: #fff;
  }
  `}
`;

const AdminTestingDeleteTestStyled = styled.div`
  position: absolute;
  left: -25px;
  top: 50%;
  transform: scale(1) translateY(-50%);
  transition: transform 0.15s linear;

  &:hover {
    transform: scale(1.25) translateY(-50%);
  }

  ${({ isDisabled }) =>
    !isDisabled &&
    `
  color: #e32929;
  cursor: pointer;
  `}

  ${({ isDisabled }) =>
    isDisabled &&
    `
  transform: translateY(-50%) !important;
  `}
`;

const AdminTestingIconStyled = styled.div`
  margin-right: 10px;
  min-width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;

  ${({ hasScore }) =>
    hasScore &&
    `
  background: #00c020;
  color: #fff;
  font-weight: bold;
  `}
`;

const AdminTestingTextStyled = styled.div``;
