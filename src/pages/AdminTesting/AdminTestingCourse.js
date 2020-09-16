import React, {useCallback, useContext, useEffect, useState} from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import firebase from "firebase";
import AdminTestingModule from "./AdminTestingModule";
import {orderBy} from "natural-orderby";

const db = firebase.firestore();

export default function AdminTestingCourse({subjectID, course, tests}) {
    const { lang } = useContext(siteSettingsContext);
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
    }, [course, setModulesList, subjectID]);

    const filterModules = useCallback(() => {
        return modulesList.filter(moduleItem => tests.some(testItem => testItem.lesson.subjectID === subjectID && testItem.lesson.courseID === course.id && testItem.lesson.moduleID === moduleItem.id));
    }, [modulesList, subjectID, course, tests]);

    return (
        <div className="adminTesting__course">
            <div className="adminTesting__course-name">
                <i className="content_title-icon fa fa-graduation-cap"/>
                { course.name[lang] ? course.name[lang] : course.name['ua'] }
            </div>
            {
                modulesList && filterModules().length ?
                    <div className="adminTesting__modulesList">
                        { orderBy(filterModules(), v => v.index).map(moduleItem => <AdminTestingModule subjectID={subjectID} courseID={course.id} module={moduleItem} tests={tests} key={moduleItem.id}/>) }
                    </div>
                    :
                    null
            }
        </div>
    );
}