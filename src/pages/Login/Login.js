import React, {useContext, useEffect, useState} from 'react';
import Form from '../../components/Form/Form';
import './login.scss';
import DocumentTitle from "react-document-title";
import siteSettingsContext from "../../context/siteSettingsContext";
import Preloader from "../../components/UI/preloader";
import LanguageSelect from "../../components/language/languageSelect";
import { loginUser } from "../../redux/actions/authActions";
import { connect } from 'react-redux';

const errors = {
    userNotFound: 'user_not_found',
    wrongPassword: 'wrong_password',
    inactiveUser: 'inactive_user'
};

function Login({loading, error, loginUser}) {
    const { translate, siteName } = useContext(siteSettingsContext);
    const docTitle = siteName + ' | ' + translate('login');
    const [ formError, setFormError ] = useState(null);
    const [ formFields, setFormFields ] = useState([
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
    ]);

    useEffect(() => {
        if ( error ) {
            setFormError(translate(errors[error]));
        }
    }, [error]);

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
                    <Form formError={formError} heading={translate('login')} fields={formFields} formAction={sendLogin} setFieldValue={setFieldValue}/>
                    {
                        loading ?
                            <Preloader/>
                            :
                            null
                    }
                </div>
            </div>
        </DocumentTitle>
    );

    function setFieldValue(fieldID, value) {
        const newFormFields = formFields;

        newFormFields.find(field => field.id === fieldID).value = value;

        setFormFields(Object.assign([], newFormFields));
    }

    function sendLogin() {
        loginUser(formFields.find(field => field.id === 'login').value, formFields.find(field => field.id === 'password').value);
    }
}

const mapStateToProps = state => {
    return {
        loading: state.authReducer.loading,
        error: state.authReducer.error
    }
};

const mapDispatchToProps = dispatch => ({
    loginUser: (login, password) => dispatch(loginUser(login, password))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
