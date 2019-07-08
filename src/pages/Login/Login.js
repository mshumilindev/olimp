import React from 'react';
import Form from '../../components/Form/Form';
import './login.scss';
import DocumentTitle from "react-document-title";
import SiteSettingsContext from "../../context/siteSettingsContext";
import {Preloader} from "../../components/UI/preloader";
import firebase from "../../db/firestore";
import LanguageSelect from "../../components/language/languageSelect";

const db = firebase.firestore();

const errors = {
    userNotFound: 'user_not_found',
    wrongPassword: 'wrong_password'
};

export default class Login extends React.Component {
    constructor() {
        super();

        this.state = {
            formError: null,
            loading: false,
            formAction: this.sendLogin.bind(this),
            formFields: [
                {
                    id: 'login',
                    name: 'login',
                    type: 'text',
                    value: '',
                    required: true
                },
                {
                    id: 'password',
                    name: 'password',
                    type: 'password',
                    value: '',
                    required: true
                },
                {
                    name: 'login_btn',
                    type: 'submit'
                }
            ]
        };

        this.setFieldValue = this.setFieldValue.bind(this);
    }

    render() {
        const { siteName, translate } = this.context;
        const docTitle = siteName + ' | ' + translate('login');

        return (
            <DocumentTitle title={ docTitle }>
                <div className="login">
                    <div className="login__box">
                        <LanguageSelect />
                        <Form formError={this.state.formError} heading={translate('login')} fields={this.state.formFields} formAction={this.state.formAction} setFieldValue={this.setFieldValue}/>
                        {
                            this.state.loading ?
                                <Preloader/>
                                :
                                null
                        }
                    </div>
                </div>
            </DocumentTitle>
        );
    }

    setFieldValue(fieldID, value) {
        this.state.formFields.find(field => field.id === fieldID).value = value;

        this.setState(state => {
            return {
                formFields: state.formFields
            }
        });
    }

    sendLogin() {
        this.setState(() => {
            return {
                loading: true
            }
        });

        const login = this.state.formFields.find(field => field.id === 'login').value;
        const password = this.state.formFields.find(field => field.id === 'password').value;

        const userDoc = db.collection('users').doc(login);

        userDoc.get().then((doc) => {
            if ( !doc.exists ) {
                this.setState(() => {
                    return {
                        formError: errors.userNotFound
                    }
                });
            }
            else {
                if ( doc.data().password !== password ) {
                    this.setState(() => {
                        return {
                            formError: errors.wrongPassword
                        }
                    });
                }
                else {
                    this.setState(() => {
                        return {
                            formError: null
                        }
                    });
                    localStorage.setItem('user', JSON.stringify({
                        name: doc.data().name,
                        data: doc.data().data,
                        role: doc.data().role,
                        class: doc.data().class
                    }));
                    window.location.reload();
                }
            }
            this.setState(() => {
                return {
                    loading: false
                }
            });
        });
    }
}
Login.contextType = SiteSettingsContext;
