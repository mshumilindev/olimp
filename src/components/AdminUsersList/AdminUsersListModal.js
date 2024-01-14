import React, {useContext, useState} from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import generator from 'generate-password';
import { updateUser } from "../../redux/actions/usersActions";
import {connect} from "react-redux";

import Modal from '../../components/UI/Modal/Modal';
import Form from '../../components/Form/Form';

function AdminUsersListModal({loading, usersList, currentUser, user, classesList, allCoursesList, modalTrigger, onToggleModal, updateUser}) {
    const { translate, getUserFormFields, lang } = useContext(siteSettingsContext);
    const [ showModal, setShowModal ] = useState(false);
    const [ userFields, setUserFields ] = useState(getUserFields(currentUser, user, classesList, allCoursesList, []));
    const [ formUpdated, setFormUpdated ] = useState(false);

    return (
        <>
            <span onClick={e => { e.preventDefault(); toggleModal() } }>
                { modalTrigger }
            </span>
            {
                showModal ?
                    <Modal onHideModal={() => toggleModal()}>
                        <Form formUpdated={formUpdated} loading={loading} heading={translate('editing_user')} fields={userFields} setFieldValue={setFieldValue} formAction={handleUpdateUser} formReset={resetUser}/>
                    </Modal>
                    :
                    null
            }
        </>
    );

    function getUserFields(currentUser, user, classesList, allCoursesList, userFields) {

        const formFields = getUserFormFields(currentUser, user, generatePassword);

        if ( user.role === 'student' && classesList ) {
            formFields.splice(2, 0, insertClass(classesList, user, userFields));
        }
        if ( user.role === 'teacher' && allCoursesList ) {
            formFields.splice(2, 0, insertCourse(allCoursesList, user, userFields))
        }

        formFields.push(
            {
                type: 'actions',
                id: 'actions',
                children: [
                    {
                        type: 'reset',
                        id: 'reset',
                        name: translate('reset')
                    },
                    {
                        type: 'submit',
                        id: 'save',
                        name: user.id ? translate('update') : translate('create')
                    }
                ]
            }
        );

        return formFields;
    }

    function toggleModal() {
        if ( showModal && onToggleModal ) {
            onToggleModal();
        }
        if ( showModal ) {
            document.querySelector('.section__title-holder').style.zIndex = 10;
        }
        else {
            document.querySelector('.section__title-holder').style.zIndex = 9999;
        }

        if ( !showModal ) {
            setUserFields(Object.assign([], getUserFields(currentUser, user, classesList, allCoursesList, userFields)));
        }
        setFormUpdated(false);
        setShowModal(!showModal);
    }

    function resetUser() {
        setUserFields(Object.assign([], getUserFields(currentUser, user, classesList, allCoursesList, userFields)));
        setFormUpdated(false);
    }

    function findFieldInBlock(item, fieldID) {
        return item.children.find(child => {
            if ( child.id === fieldID ) {
                return child;
            }
            return false;
        });
    }

    function setFieldValue(fieldID, value) {
        let field = null;

        userFields.find(fieldItem => {
            if ( fieldItem.type === 'tabs' ) {
                fieldItem.tabs.find(tabItem => {
                    tabItem.content.find(item => {
                        if ( item.type === 'block' || item.type === 'cols' ) {
                            field = findFieldInBlock(item, fieldID);
                        }
                        else {
                            if ( item.id === fieldID ) {
                                field = item;
                            }
                        }
                        return field;
                    });
                    return field;
                });
            }
            else if ( fieldItem.type === 'block' || fieldItem.type === 'cols' ) {
                field = findFieldInBlock(fieldItem, fieldID);
            }
            else {
                if ( fieldItem.id === fieldID ) {
                    field = fieldItem;
                }
            }
            return field;
        });

        if ( fieldID === 'login' ) {
            if ( usersList.some(item => item.id !== user.id && item.login === value) ) {
                field.hasErrors = true;
                field.errorMessage = translate('login_already_exists');
            }
            else {
                field.hasErrors = false;
                field.errorMessage = null;
            }
        }

        if ( field.storedValue !== undefined ) {
            field.storedValue = value;

            if ( fieldID === 'class' ) {
                const selectedClass = classesList.find(item => item.id === value);
                field.value = selectedClass ? selectedClass.title[lang] ? selectedClass.title[lang] : selectedClass.title['ua'] : value;
            }
            else {
                field.value = value;
            }
        }
        else {
            field.value = value;
        }

        field.updated = true;

        if ( fieldID === 'role' ) {
            if ( value === 'student' ) {
                userFields.splice(2, 0, insertClass(classesList, user, userFields));
            }
            else if ( value === 'teacher' ) {
                userFields.splice(2, 0, insertCourse(allCoursesList, user, userFields));
            }
            else {
                if ( userFields.some(item => item.id === 'class') ) {
                    userFields.splice(2, 1);
                }
            }
        }

        setUserFields(Object.assign([], userFields));
        setFormUpdated(true);
    }

    function insertClass(classesList, user, userFields) {
        const opts = [];
        const selectedClass = classesList.find(item => item.id === user.class);

        if ( userFields.some(item => item.id === 'courses') ) {
            userFields.splice(2, 1);
        }
        if ( userFields.some(item => item.id === 'class') ) {
            userFields.splice(2, 1);
        }

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
            value: user && selectedClass ? selectedClass.title[lang] ? selectedClass.title[lang] : selectedClass.title['ua'] : '',
            storedValue: user && selectedClass ? selectedClass.id : '',
            updated: false,
            options: [
                ...opts
            ]
        };
    }

    function insertCourse(allCoursesList, user, userFields) {
        const selectedCourses = [];

        if ( userFields.some(item => item.id === 'class') ) {
            userFields.splice(2, 1);
        }
        if ( userFields.some(item => item.id === 'courses') ) {
            userFields.splice(2, 1);
        }

        allCoursesList.forEach(subject => {
            if ( subject.coursesList ) {
                subject.coursesList.forEach(course => {
                    if ( course.teacher === user.id ) {
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

    function handleUpdateUser() {
        let userID = user.id;

        const updatedFields = getUpdatedFields();

        if ( user.id ) {
            delete updatedFields.id;
        }
        else {
            userID = generateID();
        }

        setShowModal(false);
        updateUser(userID, updatedFields);
    }

    function generateID() {
        return generator.generate({
            length: 16
        });
    }

    function getUpdatedFields() {
        const updatedFields = {};

        userFields.forEach(field => {
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
                        if ( child.type === 'block' ) {
                            child.children.forEach(blockChild => {
                                if ( blockChild.updated ) {
                                    Object.assign(updatedFields, {[blockChild.id]: blockChild.value});
                                }
                            });
                        }
                        else {
                            if ( child.updated ) {
                                Object.assign(updatedFields, {[child.id]: child.value});
                            }
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
            ...user,
            ...updatedFields
        });

        delete updatedFields.isNew;

        return updatedFields;
    }
}

const mapStateToProps = state => ({
    classesList: state.classesReducer.classesList,
    allCoursesList: state.coursesReducer.coursesList,
    loading: state.classesReducer.loading,
    currentUser: state.authReducer.currentUser
});
const mapDispatchToProps = dispatch => ({
    updateUser: (id, data) => dispatch(updateUser(id, data))
});
export default connect(mapStateToProps, mapDispatchToProps)(AdminUsersListModal);
