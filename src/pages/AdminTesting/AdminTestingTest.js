import React, {useContext, useEffect, useState} from 'react';
import classNames from 'classnames';
import Modal from "../../components/UI/Modal/Modal";
import firebase from "firebase";
import {orderBy} from "natural-orderby";
import {Preloader} from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import Article from "../../components/Article/Article";
import Form from "../../components/Form/Form";
import {updateTest} from "../../redux/actions/testsActions";
import { connect } from 'react-redux';

const db = firebase.firestore();

function AdminTestingTest({test, userItem, lesson, updateTest}) {
    const [ showModal, setShowModal ] = useState(false);
    const [ lessonQA, setLessonQA ] = useState(null);
    const { translate, lang } = useContext(siteSettingsContext);
    const [ score, setScore ] = useState(test.score);

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
    }, [showModal]);

    return (
        <div className={classNames('adminTesting__test', {noScore: !test.score})}>
            <div className="adminTesting__test-inner" onClick={() => setShowModal(!showModal)}>
                {
                    test.score ?
                        <i className="content_title-icon">{ test.score }</i>
                        :
                        <i className="content_title-icon fa fa-hourglass-half" />
                }
                { userItem.name }
            </div>
            {
                showModal ?
                    <Modal onHideModal={() => setShowModal(false)} heading={`<span>${(lesson.name[lang] ? lesson.name[lang] : lesson.name['ua'])} / </span>${translate('test_qa_for')} ${userItem.name}`}>
                        {
                            lessonQA ?
                                <>
                                    <Article content={reworkQA(lessonQA)}/>
                                    <hr/>
                                    <Form fields={[{type: 'text', placeholder: 'score', id: 'score', value: score}]} setFieldValue={(fieldID, value) => setScore(value)}/>
                                    <div className="adminTesting__btnScore">
                                        <span className="btn btn_primary" disabled={!score} onClick={handleSetScore}>
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
        </div>
    );

    function reworkQA() {
        const newQA = [];

        lessonQA.forEach(item => {
            if ( item.type !== 'answers' ) {
                newQA.push(item);
            }
            else {
                newQA.push({
                    ...item,
                    type: item.value.type === 'formula' ? 'formula' : 'text',
                    value: {
                        ua: test.blocks.find(block => block.id === item.id).value.join(', ')
                    }
                });
            }
        });

        return newQA;
    }

    function handleSetScore() {
        if ( score ) {
            updateTest({
                ...test,
                score: score
            });
            setShowModal(false);
        }
    }
}

const mapDispatchToProps = dispatch => ({
    updateTest: (newTest) => dispatch(updateTest(newTest))
});

export default connect(null, mapDispatchToProps)(AdminTestingTest);