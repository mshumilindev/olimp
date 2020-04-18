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
    wrongPassword: 'wrong_password',
    inactiveUser: 'inactive_user'
};

export default class Login extends React.Component {
    constructor(props, context) {
        super();

        const { translate } = context;

        this.state = {
            formError: null,
            loading: false,
            formAction: this.sendLogin.bind(this),
            formFields: [
                {
                    id: 'login',
                    name: 'login',
                    type: 'text',
                    placeholder: translate('login'),
                    value: '',
                    required: true
                },
                {
                    id: 'password',
                    name: 'password',
                    type: 'password',
                    placeholder: translate('password'),
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
                        {
                            window.location.pathname === '/suspended' ?
                                <div className="loginError">{ translate('account_suspended_or_removed') }</div>
                                :
                                null
                        }
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
                    if ( snapshot.docs[0].data().status !== 'active' ) {
                        this.setState(() => {
                            return {
                                formError: errors.inactiveUser
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
                            avatar: snapshot.docs[0].data().avatar,
                            email: snapshot.docs[0].data().email,
                            id: snapshot.docs[0].id,
                            name: snapshot.docs[0].data().name,
                            role: snapshot.docs[0].data().role,
                            skype: snapshot.docs[0].data().skype,
                            tel: snapshot.docs[0].data().tel,
                            login: snapshot.docs[0].data().login,
                            class: snapshot.docs[0].data().class,
                            scores: snapshot.docs[0].data().scores,
                            canSeeGuests: snapshot.docs[0].data().canSeeGuests
                        }));
                        if ( snapshot.docs[0].data().role === 'admin' || snapshot.docs[0].data().role === 'teacher' ) {
                            window.location.replace('/admin');
                        }
                        else {
                            window.location.replace('/');
                        }
                    }
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
