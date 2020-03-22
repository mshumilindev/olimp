import React, { useContext, useEffect, useState } from 'react';
import classNames from "classnames";
import siteSettingsContext from "../../context/siteSettingsContext";
const initialTime = '09:00';

export default function AdminClassScheduleDayCourse({selectedLessons, coursesList, item, setSelectedLessons}) {
    const { lang } = useContext(siteSettingsContext);
    const currentSubject = coursesList.find(subject => subject.id === item.subject);
    const currentCourse = currentSubject.coursesList.find(course => course.id === item.course);
    const [ time, setTime ] = useState(item.time ? item.time : initialTime);

    useEffect(() => {
        if ( !time ) {
            setTime(initialTime);
        }
    });

    return (
        <div className={classNames('adminClass__schedule-courses-item', {selected: JSON.parse(selectedLessons).some(lesson => lesson.subject === item.subject && lesson.course === item.course)})}>
            <div className="adminClass__schedule-courses-item-inner">
                {
                    JSON.parse(selectedLessons).some(lesson => lesson.subject === item.subject && lesson.course === item.course) ?
                        <i className="content_title-icon far fa-check-square" onClick={toggleLesson} />
                        :
                        <i className="content_title-icon far fa-square" onClick={toggleLesson} />
                }
                <div className="adminClass__schedule-courses-item-subject" onClick={toggleLesson}>
                    {
                        currentSubject.name[lang] ? currentSubject.name[lang] : currentSubject.name['ua']
                    }
                </div>
                <div className="adminClass__schedule-courses-item-course" onClick={toggleLesson}>
                    {
                        currentCourse.name[lang] ? currentCourse.name[lang] : currentCourse.name['ua']
                    }
                </div>
            </div>
            <form className="form" style={{minHeight: 0, width: 'auto'}}>
                <input type="time" className="form__field" value={time} onChange={e => handleTime(e.target.value)}/>
            </form>
        </div>
    );

    function toggleLesson() {
        const newSelectedLessons = JSON.parse(selectedLessons);
        item.time = time;

        if ( newSelectedLessons.some(newItem => newItem.subject === item.subject && newItem.course === item.course) ) {
            newSelectedLessons.splice(newSelectedLessons.indexOf(newSelectedLessons.find(newItem => newItem.subject === item.subject && newItem.course === item.course)), 1);
        }
        else {
            newSelectedLessons.push(item);
        }
        setSelectedLessons(JSON.stringify(newSelectedLessons));
    }

    function handleTime(newTime) {
        const newSelectedLessons = JSON.parse(selectedLessons);
        const currentLesson = newSelectedLessons.find(newItem => newItem.subject === item.subject && newItem.course === item.course);

        setTime(newTime);
        item.time = newTime;

        if ( currentLesson ) {
            currentLesson.time = newTime;
            setSelectedLessons(JSON.stringify(newSelectedLessons));
        }
    }
}