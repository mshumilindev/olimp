import React from 'react';
import firebase from "../db/firestore";

const db = firebase.firestore();

const withSaveCourse = WrappedComponent => {
    return class SaveCourse extends React.Component {
        constructor(props) {
            super(props);

            this.getCourseToSave = this.getCourseToSave.bind(this);
            this.coursesToSaveArr = [];
        }

        render() {
            return <WrappedComponent getCourseToSave={this.getCourseToSave} {...this.state} {...this.props} />
        }

        get coursesToSave() {
            return this.coursesToSaveArr;
        }

        set coursesToSave(query) {
            if ( !this.coursesToSaveArr.some(item => item.subject === query.subject) ) {
                this.coursesToSaveArr.push(query);
            }
        }

        getCourseToSave(subject, courseID, isLast) {
            if ( subject ) {
                this.coursesToSave = {subject, courseID};
            }
            if ( isLast ) {
                this.saveCourses();
            }
        }

        saveCourses() {
            const { saveCourse, coursesList } = this.props;
            const coursesListFromStorage = localStorage.getItem('courses') ? JSON.parse(localStorage.getItem('courses')).data : [];

            if ( this.coursesToSave.length && !coursesList.length && !coursesListFromStorage.length ) {
                this.coursesToSave.map(item => {
                    if ( !coursesList.some(savedCourse => savedCourse.id === item.courseID) && !coursesListFromStorage.some(savedCourse => savedCourse.id === item.courseID) ) {
                        const courseRef = db.doc('courses/' + item.subject + '/coursesList/' + item.courseID);

                        courseRef.get().then(doc => {
                            if ( doc.exists ) {
                                saveCourse(doc.data());
                            }
                        });
                    }
                    return item;
                });
            }
        }
    };
};

export default withSaveCourse;
