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
                    type: 'submit',
                    id: 'login_btn'
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

        const userRef = db.collection('users');
        const userCollection = userRef.where('login', '==', login);

        userCollection.get().then((snapshot) => {
            if ( !snapshot.docs.length ) {
                this.setState(() => {
                    return {
                        formError: errors.userNotFound
                    }
                });
            }
            else {
                if ( snapshot.docs[0].data().password !== password ) {
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
                        name: snapshot.docs[0].data().name,
                        login: snapshot.docs[0].data().login,
                        role: snapshot.docs[0].data().role,
                        class: snapshot.docs[0].data().class,
                        avatar: snapshot.docs[0].data().avatar,
                        id: snapshot.docs[0].id
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
