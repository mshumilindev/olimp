import React, {useCallback, useContext, useEffect, useState} from 'react';
import classNames from 'classnames';
import Modal from "../../components/UI/Modal/Modal";
import firebase from "firebase";
import {orderBy} from "natural-orderby";
import Preloader from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import Article from "../../components/Article/Article";
import Form from "../../components/Form/Form";
import {updateTest, deleteTest} from "../../redux/actions/testsActions";
import { connect } from 'react-redux';
import Confirm from "../../components/UI/Confirm/Confirm";

const db = firebase.firestore();

function AdminTestingTest({test, userItem, lesson, updateTest, deleteTest}) {
    const [ showModal, setShowModal ] = useState(false);
    const [ lessonQA, setLessonQA ] = useState(null);
    const { translate, lang } = useContext(siteSettingsContext);
    const [ score, setScore ] = useState(test.score);
    const [ showConfirmDelete, setShowConfirmDelete ] = useState(false);
    const [ comments, setComments] = useState(test.comments || test.blocks.map(item => {
        return {
            id: 'comment_' + item.id,
            value: ''
        }
    }));

    useEffect(() => {
        if ( showModal && !lessonQA ) {
            const QARef = db.collection('courses').doc(test.lesson.subjectID).collection('coursesList').doc(test.lesson.courseID).collection('modules').doc(test.lesson.moduleID).collection('lessons').doc(test.lesson.lessonID).collection('QA');

            QARef.get().then(snapshot => {
                const QA = [];

                if ( snapshot.docs.length ) {
                    snapshot.docs.forEach(doc => {
                        QA.push({
                            ...doc.data(),
                            id: doc.id
                        });
                    });
                }
                setLessonQA(orderBy(QA, v => v.order));
            });
        }
    }, [showModal, setLessonQA, lessonQA, test]);

    const reworkQA = useCallback(() => {
        const newQA = [];

        lessonQA.forEach(item => {
            if ( item.type !== 'answers' ) {
                newQA.push(item);
            }
            else {
                const currentComment = comments.find(comItem => comItem.id === 'comment_' + item.id);

                newQA.push(
                    {
                        ...item,
                        type: item.value.type === 'formula' ? 'formula' : 'text',
                        value: {
                            ua: test.blocks.find(block => block.id === item.id).value.join(', ')
                        }
                    },
                    {
                        type: 'comment',
                        id: currentComment.id,
                        value: {
                            ua: currentComment.value
                        }
                    }
                );
            }
        });

        return newQA;
    }, [lessonQA, comments, test]);

    const handleSetScore = useCallback(() => {
        updateTest({
            ...test,
            comments: comments,
            score: score || ''
        });
        setShowModal(false);
    }, [updateTest, setShowModal, comments, test, score]);

    const handleDeleteTest = useCallback(() => {
        setShowConfirmDelete(false);
        deleteTest(test.id);
    }, [setShowConfirmDelete, deleteTest, test]);

    return (
        <div className={classNames('adminTesting__test', {noScore: !test.score})} style={!userItem ? {opacity: '.25', filter: 'grayscale(1)'} : {}}>
            <div className="adminTesting__test-inner">
                <div className="adminTesting__deleteTest" onClick={() => setShowConfirmDelete(true)}>
                    <i className="fa fa-trash-alt"/>
                </div>
                <div className="adminTesting__test-content" onClick={() => setShowModal(!showModal)}>
                    {
                        test.score ?
                            <i className="content_title-icon">{ test.score }</i>
                            :
                            <i className="content_title-icon fa fa-hourglass-half" />
                    }
                    { userItem ? userItem.name : 'Такого учня у школі більше немає' }
                </div>
            </div>
            {
                showModal ?
                    <Modal onHideModal={() => setShowModal(false)} heading={`<span>${(lesson.name[lang] ? lesson.name[lang] : lesson.name['ua'])} / </span>${translate('test_qa_for')} ${userItem ? userItem.name : 'Такого учня у школі більше немає'}`}>
                        {
                            lessonQA ?
                                <>
                                    <Article content={reworkQA(lessonQA)} comments={comments} setComments={setComments}/>
                                    <hr/>
                                    <Form fields={[{type: 'text', placeholder: 'score', id: 'score', value: score}]} setFieldValue={(fieldID, value) => setScore(value)}/>
                                    <div className="adminTesting__btnScore">
                                        <span className="btn btn_primary" onClick={handleSetScore}>
                                            { translate('set_score') }
                                        </span>
                                    </div>
                                </>
                                :
                                <Preloader/>
                        }
                    </Modal>
                    :
                    null
            }
            {
                showConfirmDelete ?
                    <Confirm message={translate('sure_to_delete_test')} cancelAction={() => setShowConfirmDelete(false)} confirmAction={handleDeleteTest} />
                    :
                    null
            }
        </div>
    );
}

const mapDispatchToProps = dispatch => ({
    updateTest: (newTest) => dispatch(updateTest(newTest)),
    deleteTest: (testID) => dispatch(deleteTest(testID))
});

export default connect(null, mapDispatchToProps)(AdminTestingTest);