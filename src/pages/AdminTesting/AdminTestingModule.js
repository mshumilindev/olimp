import React, {useContext, useEffect, useState} from 'react';
import {orderBy} from "natural-orderby";
import siteSettingsContext from "../../context/siteSettingsContext";
import firebase from "firebase";
import AdminTestingLesson from "./AdminTestingLesson";

const db = firebase.firestore();

export default function AdminTestingModule({subjectID, courseID, module, tests}) {
    const { lang } = useContext(siteSettingsContext);
    const [ lessonsList, setLessonsList ] = useState(null);

    useEffect(() => {
        const lessonsRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(courseID).collection('modules').doc(module.id).collection('lessons');

        lessonsRef.get().then(snapshot => {
            if ( snapshot.docs.length ) {
                setLessonsList(snapshot.docs.map(doc => {return{...doc.data(), id: doc.id}}));
            }
            else {
                setLessonsList([]);
            }
        });
    }, []);

    return (
        <div className="adminTesting__module">
            <div className="adminTesting__module-name">
                <i className="content_title-icon fa fa-book-open"/>
                { module.name[lang] ? module.name[lang] : module.name['ua'] }
            </div>
            {
                lessonsList && filterLessons().length ?
                    <div className="adminTesting__lessonsList">
                        { orderBy(filterLessons(), v => v.index).map(lessonItem => <AdminTestingLesson subjectID={subjectID} courseID={courseID} moduleID={module.id} lesson={lessonItem} tests={tests.filter(item => item.lesson.subjectID === subjectID && item.lesson.courseID === courseID && item.lesson.moduleID === module.id && item.lesson.lessonID === lessonItem.id)} key={lessonItem.id}/>) }
                    </div>
                    :
                    null
            }
        </div>
    );

    function filterLessons() {
        return lessonsList.filter(lessonItem => tests.some(testItem => testItem.lesson.subjectID === subjectID && testItem.lesson.courseID === courseID && testItem.lesson.moduleID === module.id && testItem.lesson.lessonID === lessonItem.id));
    }
}