import React, { useContext, useState, useEffect } from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import { connect } from "react-redux";
import {fetchProfile, updateUser} from '../../redux/actions/usersActions';
import userContext from "../../context/userContext";
import {Preloader} from "../../components/UI/preloader";
import Form from '../../components/Form/Form';
import Profile from '../../components/Profile/Profile';
import generator from "generate-password";
import './studentProfile.scss';
import Notifications from "../../components/Notifications/Notifications";

function StudentProfile({profile, fetchProfile, params, loading, classesList, allCoursesList, updateUser}) {
    const { translate, getUserFormFields, lang } = useContext(siteSettingsContext);
    const { user } = useContext(userContext);
    const [ profileUpdated, setProfileUpdated ] = useState(false);
    const [ formFields, setFormFields ] = useState(null);
    const [ currentUser, setCurrentUser ] = useState(JSON.stringify(null));
    const [ initialCurrentUser, setInitialCurrentUser ] = useState(JSON.stringify(null));

    useEffect(() => {
        if ( params && params.userLogin ) {
            fetchProfile(params.userLogin);
        }
        else {
            fetchProfile(user.login);
        }
    }, [params]);

    useEffect(() => {
        if ( profile && classesList && allCoursesList ) {
            setCurrentUser(JSON.stringify(profile));
            setInitialCurrentUser(JSON.stringify(profile));
        }
    }, [params, classesList, allCoursesList, profile]);

    useEffect(() => {
        if ( classesList && allCoursesList && JSON.parse(initialCurrentUser) ) {
            setFormFields(getUserFields());
        }
    }, [params, classesList, allCoursesList, initialCurrentUser]);

    useEffect(() => {
        if ( currentUser !== initialCurrentUser ) {
            setProfileUpdated(true);
        }
        else {
            setProfileUpdated(false);
        }
    }, [currentUser, initialCurrentUser]);

    return (
        <div className="studentProfile">
            <div className="content__title-holder">
                <h2 className="content__title">
                    <i className="content_title-icon fa fa-user" />
                    { translate('profile') }
                </h2>
                {
                    !params ?
                        <div className="content__title-actions">
                            <a href="/" className="btn btn__success" disabled={!profileUpdated} onClick={e => updateProfile(e)}>
                                <i className="content_title-icon fa fa-save" />
                                { translate('save') }
                            </a>
                        </div>
                        :
                        null
                }
            </div>
            <Notifications/>
            <div className="studentProfile__content">
                {
                    !JSON.parse(currentUser) && loading ?
                        <Preloader color={'#7f00a3'}/>
                        :
                        user.role !== 'admin' && params ?
                            <Profile user={JSON.parse(currentUser)} allCoursesList={allCoursesList} classesList={classesList}/>
                            :
                            <Form fields={formFields} loading={loading} setFieldValue={setFieldValue} />
                }
            </div>
        </div>
    );

    function setFieldValue(fieldID, value) {
        const parsedUser = JSON.parse(currentUser);

        parsedUser[fieldID] = value;
        setCurrentUser(JSON.stringify(parsedUser));
        setFormFields(getUserFields(parsedUser));
    }

    function updateProfile(e) {
        e.preventDefault();

        if ( profileUpdated ) {
            const updatedFields = getUpdatedFields();
            const userID = profile.id;

            delete profile.id;

            updateUser(userID, {
                ...profile,
                ...updatedFields
            });
            if ( !params ) {
                const userToSave = {
                    ...profile,
                    ...updatedFields
                };

                delete userToSave.password;

                localStorage.setItem('user', JSON.stringify(userToSave));
            }
            profile.id = userID;
            setFormFields(getUserFields(updatedFields));
            setProfileUpdated(false);
            setCurrentUser(JSON.stringify(updatedFields));
            setInitialCurrentUser(JSON.stringify(updatedFields));
        }
    }

    function getUpdatedFields() {
        const updatedFields = {};

        formFields.forEach(field => {
            if ( field.children ) {
                field.children.forEach(child => {
                    if ( child.updated ) {
                        Object.assign(updatedFields, {[child.id]: child.value});
                    }
                });
            }
            else if ( field.tabs ) {
                field.tabs.forEach(tab => {
                    tab.content.forEach(child => {
                        if ( child.updated ) {
                            Object.assign(updatedFields, {[child.id]: child.value});
                        }
                    });
                });
            }
            else {
                if ( field.updated ) {
                    if ( field.id === 'class' ) {
                        Object.assign(updatedFields, {[field.id]: field.storedValue});
                    }
                    else {
                        Object.assign(updatedFields, {[field.id]: field.value});
                    }
                }
            }
        });
        Object.assign(updatedFields, {
            ...JSON.parse(currentUser),
            ...updatedFields
        });

        delete updatedFields.isNew;

        return updatedFields;
    }

    function getUserFields(newProfile) {
        const useProfile = newProfile || JSON.parse(currentUser);
        const formFields = getUserFormFields(useProfile, generatePassword, true);

        if ( useProfile.role === 'student' && classesList ) {
            formFields.splice(2, 0, insertClass(newProfile));
        }
        if ( useProfile.role === 'teacher' && allCoursesList ) {
            formFields.splice(2, 0, insertCourse())
        }

        return formFields;
    }

    function insertClass(newProfile) {
        const opts = [];
        const profileClass = newProfile ? newProfile.class : JSON.parse(currentUser).class;
        const selectedClass = classesList.find(item => item.id === profileClass);

        classesList.sort((a, b) => {
            const aTitle = a.title[lang] || a.title['ua'];
            const bTitle = b.title[lang] || b.title['ua'];

            if ( aTitle < bTitle ) {
                return -1;
            }
            else if ( aTitle > bTitle ) {
                return 1;
            }
            return 0;
        }).sort((a, b) => {
            const aTitle = parseInt(a.title[lang]) || parseInt(a.title['ua']);
            const bTitle = parseInt(b.title[lang]) || parseInt(b.title['ua']);

            return aTitle - bTitle;
        }).forEach(item => {
            opts.push({
                id: item.id,
                title: item.title[lang] ? item.title[lang] : item.title['ua']
            });
        });

        return {
            type: 'select',
            id: 'class',
            name: 'class',
            placeholder: 'class',
            hasErrors: false,
            value: JSON.parse(currentUser) && selectedClass ? selectedClass.title[lang] ? selectedClass.title[lang] : selectedClass.title['ua'] : '',
            storedValue: JSON.parse(currentUser) && selectedClass ? selectedClass.id : '',
            updated: false,
            readonly: true,
            options: [
                ...opts
            ]
        };
    }

    function insertCourse() {
        const selectedCourses = [];

        allCoursesList.forEach(subject => {
            if ( subject.coursesList ) {
                subject.coursesList.forEach(course => {
                    if ( course.teacher === JSON.parse(currentUser).id ) {
                        selectedCourses.push(course.name[lang] ? course.name[lang] : course.name['ua'])
                    }
                });
            }
        });

        return {
            type: 'text',
            id: 'courses',
            name: 'courses',
            value: selectedCourses.join(', ') ? selectedCourses.join(', ') : '',
            placeholder: translate('courses'),
            readonly: true
        }
    }

    function generatePassword(fieldID) {
        const newPassword = generator.generate({
            length: 16,
            symbols: true,
            strict: true
        });

        setFieldValue(fieldID, newPassword);
    }
}
const mapStateToProps = state => ({
    profile: state.usersReducer.profile,
    loading: state.usersReducer.loading,
    classesList: state.classesReducer.classesList,
    allCoursesList: state.coursesReducer.coursesList,
    usersList: state.usersReducer.usersList
});
const mapDispatchToProps = dispatch => ({
    updateUser: (id, data) => dispatch(updateUser(id, data)),
    fetchProfile: profileLogin => dispatch(fetchProfile(profileLogin))
});
export default connect(mapStateToProps, mapDispatchToProps)(StudentProfile);