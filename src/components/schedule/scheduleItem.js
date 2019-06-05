import React from 'react';
import {Link} from "react-router-dom";
import siteSettingsContext from "../../context/siteSettingsContext";
import {saveCourse} from "../../redux/actions/scheduleActions";
import firebase from "../../db/firestore";
import {connect} from "react-redux";

const db = firebase.firestore();

class ScheduleItem extends React.Component {
    componentDidMount() {
        const { course } = this.props;

        if ( !course ) {
            this.getCourse();
        }
    }

    render() {
        const { prefix, courseID, course } = this.props;
        const { lang } = this.context;

        return (
            course ?
                <div className={prefix + 'scheduleList_classes-item'}>
                    <Link to={'/classes/' + courseID} className={prefix + 'scheduleList_classes-text'}>{ course.name[lang] ? course.name[lang] : course.name['ua'] }</Link>
                </div>
                :
                null
        )
    }

    getCourse() {
        const { subject, saveCourse, courseID } = this.props;

        const courseRef = db.doc('courses/' + subject + '/coursesList/' + courseID);

        courseRef.get().then(doc => {
            if ( doc.exists ) {
                saveCourse(doc.data());
            }
        });
    }
}
ScheduleItem.contextType = siteSettingsContext;

export default connect(
    null,
    { saveCourse }
)(ScheduleItem)
