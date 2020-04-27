import React, {useContext} from 'react';
import siteSettingsContext from "../../../context/siteSettingsContext";
import LessonPickerCourse from "./LessonPickerCourse";
import {orderBy} from "natural-orderby";
import { connect } from 'react-redux';

function LessonPickerSubject({user, subject, setLesson, pickedLesson}) {
    const { lang } = useContext(siteSettingsContext);

    return (
        <div className="lessonPicker__subject">
            <i className="content_title-icon fa fa-folder-open" />
            { subject.name[lang] ? subject.name[lang] : subject.name['ua'] }
            <div className="lessonPicker__coursesList">
                {
                    orderBy(subject.coursesList.filter(courseItem => courseItem.teacher === user.id), v => v.name[lang] ? v.name[lang] : v.name['ua'])
                        .map(courseItem => {
                            return (
                                <LessonPickerCourse
                                    course={courseItem}
                                    subjectID={subject.id}
                                    subjectName={subject.name[lang] ? subject.name[lang] : subject.name['ua']}
                                    key={courseItem.id}
                                    setLesson={setLesson} pickedLesson={pickedLesson}
                                />
                            )
                        })
                }
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.authReducer.currentUser
    }
};

export default connect(mapStateToProps)(LessonPickerSubject);