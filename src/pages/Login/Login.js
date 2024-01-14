import React, {useContext, useEffect, useState, useCallback} from 'react';
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
    const [ savedUsers, setSavedUsers ] = useState(localStorage.getItem('savedUsers') ? JSON.parse(localStorage.getItem('savedUsers')) : null);
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
            type: 'checkbox',
            label: translate('remember_me'),
            checked: true,
            value: false,
            id: 'remember'
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

    const removeSavedUser = useCallback((user) => (e) => {
      e.stopPropagation();
      const newSavedUsers = savedUsers.filter((savedUser) => savedUser.login !== user.login) || [];

      localStorage.setItem('savedUsers', JSON.stringify(newSavedUsers))
      setSavedUsers(newSavedUsers);
    }, []);

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
                    <h2 className="form__heading">{translate('login')}</h2>
                    {
                      !!savedUsers?.length && (
                        <div className="login__saved">
                          {
                            savedUsers.map((user) => (
                              <div className="login__saved-user" onClick={() => loginUser(user.login, user.password)}>
                                <div className="login__saved-avatar" style={{backgroundImage: user.avatar ? `url(${user.avatar})` : ''}} key={user.login}>
                                  {!user.avatar && <i className="fa fa-user"/>}
                                </div>
                                <div className="login__saved-name">{user.name}</div>
                                <div className="login__saved-remove" onClick={removeSavedUser(user)}>
                                  <i class="fa-regular fa-trash-can"></i>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      )
                    }
                    <Form formError={formError} fields={formFields} formAction={sendLogin} setFieldValue={setFieldValue}/>
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
      loginUser(formFields.find(field => field.id === 'login').value, formFields.find(field => field.id === 'password').value, formFields.find(field => field.id === 'remember').value);
    }
}

const mapStateToProps = state => {
    return {
        loading: state.authReducer.loading,
        error: state.authReducer.error
    }
};

const mapDispatchToProps = dispatch => ({
    loginUser: (login, password, remember) => dispatch(loginUser(login, password, remember))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
