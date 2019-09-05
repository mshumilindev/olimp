import firebase from "../../db/firestore";

const db = firebase.firestore();
const level = '1a'; // === THIS IS PLACEHOLDER, NEEDS TO BE DYNAMIC

// === NEEDS OPTIMIZATION, AS THOSE ARE SAME REQUESTS

// === FETCH SCHEDULE
export const FETCH_SCHEDULE_BEGIN = 'FETCH_SCHEDULE_BEGIN';
export const FETCH_SCHEDULE_SUCCESS = 'FETCH_SCHEDULE_SUCCESS';
const newSchedule = [];
const scheduleCollection = db.collection('levels/' + level + '/schedule');

export function fetchSchedule() {
    if ( !newSchedule.length ) {
        return dispatch => {
            dispatch(fetchScheduleBegin());
            return scheduleCollection.get().then((data) => {
                data.docs.map(doc => newSchedule.push(doc.data()));

                dispatch(fetchScheduleSuccess(newSchedule));
            });
        }
    }
    else {
        return dispatch => {
            dispatch(fetchScheduleSuccess(newSchedule))
        }
    }
}

export const fetchScheduleBegin =() => {
    return {
        type: FETCH_SCHEDULE_BEGIN
    }
};
export const fetchScheduleSuccess = scheduleList => {
    return {
        type: FETCH_SCHEDULE_SUCCESS,
        payload: { scheduleList }
    }
};

// === FETCH LEVEL COURSES
export const FETCH_LEVEL_COURSES_BEGIN = 'FETCH_LEVEL_COURSES_BEGIN';
export const FETCH_LEVEL_COURSES_SUCCESS = 'FETCH_LEVEL_COURSES_SUCCESS';

const newLevelCourses = [];
const levelCoursesCollection = db.collection('levels/' + level + '/courses');

export function fetchLevelCourses() {
    if ( !newLevelCourses.length ) {
        return dispatch => {
            dispatch(fetchLevelCoursesBegin());
            return levelCoursesCollection.get().then((data) => {
                data.docs.map(doc => newLevelCourses.push({[doc.id]: doc.data().course}));

                dispatch(fetchLevelCoursesSuccess(newLevelCourses));
            });
        }
    }
    else {
        return dispatch => {
            dispatch(fetchLevelCoursesSuccess(newLevelCourses))
        }
    }
}

export const fetchLevelCoursesBegin =() => {
    return {
        type: FETCH_LEVEL_COURSES_BEGIN
    }
};
export const fetchLevelCoursesSuccess = levelCoursesList => {
    return {
        type: FETCH_LEVEL_COURSES_SUCCESS,
        payload: { levelCoursesList }
    }
};

// === COURSES ACTIONS
const coursesCollection = [];

// === FETCH COURSES
export const FETCH_COURSES_BEGIN = 'FETCH_COURSES_BEGIN';
export const FETCH_COURSES_SUCCESS = 'FETCH_COURSES_SUCCESS';

export function fetchCourses() {
    return dispatch => {
        dispatch(fetchCourseSuccess(coursesCollection));
    }
}

export const fetchCourseSuccess = coursesList => {
    return {
        type: FETCH_COURSES_SUCCESS,
        payload: { coursesList }
    }
};

// === SAVE FETCHED COURSES
export const SAVE_COURSE_BEGIN = 'SAVE_COURSE_BEGIN';
export const SAVE_COURSE_SUCCESS = 'SAVE_COURSE_SUCCESS';

export function saveCourse(course) {
    return dispatch => {
        dispatch(saveCourseBegin());
        if (!coursesCollection.some(item => item.id === course.id)) {
            coursesCollection.push(course);
        }
        dispatch(saveCourseSuccess(coursesCollection))
    }
}

export const saveCourseBegin =() => {
    return {
        type: SAVE_COURSE_BEGIN
    }
};
export const saveCourseSuccess = coursesList => {
    return {
        type: SAVE_COURSE_SUCCESS,
        payload: { coursesList }
    }
};

// === FETCH CALENDAR
export const FETCH_CALENDAR_BEGIN = 'FETCH_CALENDAR_BEGIN';
export const FETCH_CALENDAR_SUCCESS = 'FETCH_CALENDAR_SUCCESS';

const newCalendar = {};
const calendarCollection = db.collection('calendar');

export function fetchCalendar() {
    if ( !Object.keys(newCalendar).length ) {
        return dispatch => {
            dispatch(fetchCalendarBegin());
            return calendarCollection.get().then(data => {
                data.docs.map(doc => newCalendar[doc.id] = doc.data());

                dispatch(fetchCalendarSuccess(newCalendar));
            });
        }
    }
    else {
        return dispatch => {
            dispatch(fetchCalendarSuccess(newCalendar))
        }
    }
}

export const fetchCalendarBegin =() => {
    return {
        type: FETCH_CALENDAR_BEGIN
    }
};
export const fetchCalendarSuccess = calendar => {
    return {
        type: FETCH_CALENDAR_SUCCESS,
        payload: { calendar }
    }
};
