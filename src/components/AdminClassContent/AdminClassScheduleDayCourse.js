import React, { useContext, useState } from 'react';
import classNames from "classnames";
import siteSettingsContext from "../../context/siteSettingsContext";
const initialTime = {start: '09:00', end: '09:45'};

export default function AdminClassScheduleDayCourse({selectedLessons, coursesList, item, setSelectedLessons}) {
    const { lang } = useContext(siteSettingsContext);
    const [ time, setTime ] = useState({start: item.time && item.time.start ? item.time.start : initialTime.start, end: item.time && item.time.end ? item.time.end : initialTime.end});

    const currentSubject = coursesList.find(subject => subject.id === item.subject);

    if ( !currentSubject ) return null;

    const currentCourse = currentSubject.coursesList.find(course => course.id === item.course);

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
                <div className="form__row">
                    <div className="form__col">
                        <input type="time" className="form__field" value={time.start} onChange={e => handleTime('start', e.target.value)}/>
                    </div>
                    <div className="form__col">
                        &mdash;
                    </div>
                    <div className="form__col">
                        <input type="time" className="form__field" value={time.end} onChange={e => handleTime('end', e.target.value)}/>
                    </div>
                </div>
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

    function handleTime(type, newTime) {
        const newSelectedLessons = JSON.parse(selectedLessons);
        const currentLesson = newSelectedLessons.find(newItem => newItem.subject === item.subject && newItem.course === item.course);
        const newTimeItem = {
            [type]: newTime ? newTime : initialTime[type]
        };

        setTime({
            ...time,
            ...newTimeItem
        });

        if ( currentLesson ) {
            currentLesson.time[type] = newTime;
            setSelectedLessons(JSON.stringify(newSelectedLessons));
        }
    }
}
