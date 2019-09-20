import React from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import generator from 'generate-password';
import { updateUser } from "../../redux/actions/usersActions";
import {connect} from "react-redux";

const Modal = React.lazy(() => import('../../components/UI/Modal/Modal'));
const Form = React.lazy(() => import('../../components/Form/Form'));

class AdminUsersListModal extends React.Component {
    constructor(props, context) {
        super();

        this.state = {
            showModal: false,
            userFields: this.getUserFields(props.user, context, props.classesList, props.allCoursesList, []),
            formUpdated: false
        };

        this.getUserFields = this.getUserFields.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.setFieldValue = this.setFieldValue.bind(this);
        this.generatePassword = this.generatePassword.bind(this);
        this.resetUser = this.resetUser.bind(this);
    }

    render() {
        const { translate } = this.context;

        return (
            <>
                <span onClick={e => { e.preventDefault(); this.toggleModal() } }>
                    { this.props.modalTrigger }
                </span>
                {
                    this.state.showModal ?
                        <Modal onHideModal={() => this.toggleModal()}>
                            <Form formUpdated={this.state.formUpdated} loading={this.props.loading} heading={translate('editing_user')} fields={this.state.userFields} setFieldValue={this.setFieldValue} formAction={this.updateUser} formReset={this.resetUser}/>
                        </Modal>
                        :
                        null
                }
            </>
        );
    }

    getUserFields(user, context, classesList, allCoursesList, userFields) {
        const { translate, getUserFormFields } = context;

        const formFields = getUserFormFields(user, this.generatePassword);

        if ( user.role === 'student' && classesList ) {
            formFields.splice(2, 0, this.insertClass(context, classesList, user, userFields));
        }
        if ( user.role === 'teacher' && allCoursesList ) {
            formFields.splice(2, 0, this.insertCourse(context, allCoursesList, user, userFields))
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

    toggleModal() {
        if ( this.state.showModal && this.props.onToggleModal ) {
            this.props.onToggleModal();
        }
        if ( this.state.showModal ) {
            document.querySelector('.section__title-holder').style.zIndex = 10;
        }
        else {
            document.querySelector('.section__title-holder').style.zIndex = 9999;
        }
        this.setState(state => {
            const newState = {
                showModal: !state.showModal
            };

            if ( !state.showModal ) {
                newState.userFields = this.getUserFields(this.props.user, this.context, this.props.classesList, this.props.allCoursesList, this.state.userFields);
            }

            return {
                ...newState,
                formUpdated: false
            }
        });
    }

    resetUser() {
        this.setState(() => {
            const newState = {};

            newState.userFields = this.getUserFields(this.props.user, this.context, this.props.classesList, this.props.allCoursesList, this.state.userFields);

            return {
                ...newState,
                formUpdated: false
            }
        });
    }

    findFieldInBlock(item, fieldID) {
        return item.children.find(child => {
            if ( child.id === fieldID ) {
                return child;
            }
            return false;
        });
    }

    setFieldValue(fieldID, value) {
        const { userFields } = this.state;
        const { user, usersList, classesList, allCoursesList } = this.props;
        const { translate, lang } = this.context;

        let field = null;

        userFields.find(fieldItem => {
            if ( fieldItem.type === 'tabs' ) {
                fieldItem.tabs.find(tabItem => {
                    tabItem.content.find(item => {
                        if ( item.type === 'block' || item.type === 'cols' ) {
                            field = this.findFieldInBlock(item, fieldID);
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
                field = this.findFieldInBlock(fieldItem, fieldID);
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
                userFields.splice(2, 0, this.insertClass(this.context, classesList, user, userFields));
            }
            else if ( value === 'teacher' ) {
                userFields.splice(2, 0, this.insertCourse(this.context, allCoursesList, user, userFields));
            }
            else {
                if ( userFields.some(item => item.id === 'class') ) {
                    userFields.splice(2, 1);
                }
            }
        }

        this.setState(() => {
            return {
                userFields: userFields,
                formUpdated: true
            }
        });
    }

    insertClass(context, classesList, user, userFields) {
        const { lang } = context;
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

    insertCourse(context, allCoursesList, user, userFields) {
        const { translate, lang } = context;
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

    generatePassword(fieldID) {
        const newPassword = generator.generate({
            length: 16,
            symbols: true,
            strict: true
        });

        this.setFieldValue(fieldID, newPassword);
    }

    updateUser() {
        const { user, updateUser } = this.props;
        let userID = user.id;

        const updatedFields = this.getUpdatedFields();

        if ( user.id ) {
            delete updatedFields.id;
        }
        else {
            userID = this.generateID();
        }

        this.setState({
            showModal: false
        });
        updateUser(userID, updatedFields);
    }

    generateID() {
        return generator.generate({
            length: 16
        });
    }

    getUpdatedFields() {
        const { userFields } = this.state;
        const { user } = this.props;

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
            ...user,
            ...updatedFields
        });

        delete updatedFields.isNew;

        return updatedFields;
    }
}
AdminUsersListModal.contextType = siteSettingsContext;

const mapStateToProps = state => ({
    classesList: state.classesReducer.classesList,
    allCoursesList: state.coursesReducer.coursesList,
    loading: state.classesReducer.loading
});
const mapDispatchToProps = dispatch => ({
    updateUser: (id, data) => dispatch(updateUser(id, data))
});
export default connect(mapStateToProps, mapDispatchToProps)(AdminUsersListModal);
