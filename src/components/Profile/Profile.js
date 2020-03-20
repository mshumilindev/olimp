import React, { useContext } from 'react';
import './profile.scss';
import siteSettingsContext from "../../context/siteSettingsContext";

function Profile({user, allCoursesList, classesList}) {
    const { translate, lang } = useContext(siteSettingsContext);

    return (
        <div className="profile">
            {
                user ?
                    <>
                        <div className="profile__avatar-holder">
                            <div className={'profile__status ' + user.status}/>
                            <div className="profile__avatar" style={{backgroundImage: 'url(' + user.avatar + ')'}}>
                                {
                                    !user.avatar ?
                                        <i className="fas fa-camera-retro" />
                                        :
                                        null
                                }
                            </div>
                        </div>
                        <div className="profile__info">
                            <div className="profile__name">
                                { user.name }
                            </div>
                            <div className="profile__role">
                                { translate(user.role) }
                                {
                                    user.role === 'student' ?
                                        <div className="profile__class">
                                            {
                                                user.class && classesList.length ?
                                                    classesList.find(item => item.id === user.class).title[lang] ?
                                                        classesList.find(item => item.id === user.class).title[lang]
                                                        :
                                                        classesList.find(item => item.id === user.class).title['ua']
                                                    :
                                                    <div className="nothingFound">
                                                        { translate('no_class') }
                                                    </div>
                                            }
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            {
                                user.role === 'teacher' ?
                                    <div className="profile__courses">
                                        <div className="profile__heading">
                                            {
                                                translate('courses')
                                            }
                                        </div>
                                        {
                                            checkForCourses().length ?
                                                checkForCourses().map(course => {
                                                    return (
                                                        <div className="profile__courses-item" key={course.course.id}>
                                                            <i className="fa fa-graduation-cap" />
                                                            { course.course.name[lang] ? course.course.name[lang] : course.course.name['ua'] }
                                                        </div>
                                                    )
                                                })
                                                :
                                                <div className="nothingFound">
                                                    { translate('have_no_courses') }
                                                </div>
                                        }
                                    </div>
                                    :
                                    null
                            }
                            {
                                user.email || user.tel || user.skype ?
                                    <>
                                        <div className="profile__heading">
                                            {
                                                translate('contact')
                                            }
                                        </div>
                                        <div className="profile__contact">
                                            {
                                                user.email ?
                                                    <div className="profile__contact-item">
                                                        <i className="far fa-envelope" />
                                                        <a href={'mailto:' + user.email}>
                                                            { user.email }
                                                        </a>
                                                    </div>
                                                    :
                                                    null
                                            }
                                            {
                                                user.tel ?
                                                    <div className="profile__contact-item">
                                                        <i className="fa fa-mobile-alt" />
                                                        <a href={'tel:' + user.tel}>
                                                            { user.tel }
                                                        </a>
                                                    </div>
                                                    :
                                                    null
                                            }
                                            {
                                                user.skype ?
                                                    <div className="profile__contact-item">
                                                        <i className="fab fa-skype" />
                                                        <a href={'skype:' + user.skype + '?chat'}>
                                                            { user.skype }
                                                        </a>
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                    </>
                                    :
                                    null
                            }
                        </div>
                    </>
                    :
                    null
            }
        </div>
    );

    function checkForCourses() {
        const selectedCourses = [];

        allCoursesList.forEach(subject => {
            if ( subject.coursesList.length ) {
                subject.coursesList.forEach(course => {
                    if ( course.teacher === user.id ) {
                        selectedCourses.push({
                            link: subject.id + '/' + course.id,
                            course: course
                        })
                    }
                });
            }
        });

        return selectedCourses;
    }
}
export default Profile;