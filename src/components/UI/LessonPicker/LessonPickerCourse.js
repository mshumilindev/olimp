import React, {useContext, useEffect, useState} from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import firebase from "firebase";
import LessonPickerModule from "./LessonPickerModule";
import {orderBy} from "natural-orderby";

const db = firebase.firestore();

export default function LessonPickerCourse({subjectID, course, setLesson, pickedLesson, subjectName}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ modulesList, setModulesList ] = useState(null);

    useEffect(() => {
        const modulesRef = db.collection('courses').doc(subjectID).collection('coursesList').doc(course.id).collection('modules');

        modulesRef.get().then(snapshot => {
            if ( snapshot.docs.length ) {
                setModulesList(snapshot.docs.map(doc => {return {...doc.data(), id: doc.id}}));
            }
            else {
                setModulesList([]);
            }
        });
    }, []);

    return (
        <div className="lessonPicker__course">
            <i className="content_title-icon fa fa-graduation-cap" />
            { course.name[lang] ? course.name[lang] : course.name['ua'] }
            {
                modulesList ?
                    <div className="lessonPicker__modulesList">
                        {
                            modulesList.length ?
                                orderBy(modulesList, v => v.index).map(moduleItem => {
                                    return (
                                        <LessonPickerModule
                                            subjectID={subjectID}
                                            subjectName={subjectName}
                                            courseID={course.id}
                                            courseName={course.name[lang] ? course.name[lang] : course.name['ua']}
                                            module={moduleItem}
                                            key={moduleItem.id}
                                            setLesson={setLesson}
                                            pickedLesson={pickedLesson}
                                        />
                                    );
                                })
                                :
                                <div className="lessonPicker__module notFound">
                                    <i className="content_title-icon fa fa-unlink" />
                                    { translate('no_modules') }
                                </div>
                        }
                    </div>
                    :
                    null
            }
        </div>
    )
}