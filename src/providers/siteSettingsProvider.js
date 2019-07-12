import React from 'react';
import SiteSettingsContext from '../context/siteSettingsContext';
import firebase from "../db/firestore";

const db = firebase.firestore();

// === Methods must be moved to redux, properties must be moved to context to make stateless components

export default class SiteSettingsProvider extends React.Component{
    constructor() {
        super();
        this.state = {
            siteName: 'КОЛЕГІУМ "ОЛІМП"', // === Need to get it from db and save to localStorage
            translations: [],
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'ua',
            level: '1a',
            changeLang: (lang) => {
                this.setLang(lang);
            },
            translate: (term) => {
                return !this.state.translations[this.state.lang] || !this.state.translations[this.state.lang][term] ? term :this.state.translations[this.state.lang][term];
            },
            getUserFormFields: (user, passwordAction) => {
                return this.getUserFormFields(user, passwordAction);
            },
            getUserModel: (role, id) => {
                return this.getUserModel(role, id)
            }
        };
    }

    componentDidMount() {
        if ( !localStorage.getItem('lang') ) {
            localStorage.setItem('lang', 'ua');
        }
        this.getTranslations();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ( prevState.lang !== this.state.lang && !this.state.translations[this.state.lang] ) {
            this.getTranslations();
        }
    }

    render() {
        return (
            <SiteSettingsContext.Provider value={this.state}>
                {
                    this.props.children
                }
            </SiteSettingsContext.Provider>
        )
    }

    setLang(lang) {
        localStorage.setItem('lang', lang);
        this.setState(() => {
            return {
                lang: lang
            }
        });
    }

    getTranslations() {
        const newTranslations = this.state.translations;
        const { lang } = this.state;

        if ( !localStorage.getItem('translations' + lang) ) {
            const navCollection = db.collection('translations').doc(lang);

            navCollection.get().then((doc) => {
                newTranslations[lang] = doc.data();

                this.setState(() => {
                    return {
                        translations: newTranslations
                    }
                });
                localStorage.setItem('translations' + lang, JSON.stringify(newTranslations[lang]));
            });
        }
        else {
            newTranslations[lang] = JSON.parse(localStorage.getItem('translations' + lang));
            this.setState(() => {
                return {
                    translations: newTranslations
                }
            });
        }
    }

    getUserModel(role, id) {
        const defaultModel = {
            name: '',
            login: '',
            password: '',
            role: role ? role : '',
            status: 'suspended',
            isNew: true
        };

        switch (role) {
            case 'admin':
                return {
                    ...defaultModel
                };

            default:
                return defaultModel;
        }
    }

    getUserFormFields(user, passwordAction) {
        const { translate } = this.state;

        const formFields = [
            {
                type: 'image',
                id: 'avatar',
                name: 'avatar',
                label: 'choose_avatar',
                value: user ? user.avatar : '',
                icon: 'fas fa-camera-retro',
                shape: 'round',
                size: 150,
                remove: true
            },
            {
                type: 'cols',
                id: 'infoCols',
                children: [
                    {
                        type: 'select',
                        id: 'role',
                        name: 'role',
                        placeholder: 'role',
                        hasErrors: false,
                        required: true,
                        value: user ? user.role : '',
                        updated: false,
                        readonly: user ? !user.isNew : false,
                        options: [
                            {
                                id: 'admin',
                                title: translate('admin')
                            },
                            {
                                id: 'teacher',
                                title: translate('teacher')
                            },
                            {
                                id: 'student',
                                title: translate('student')
                            }
                        ]
                    },
                    {
                        type: 'checkbox',
                        id: 'status',
                        name: 'status',
                        label: 'status',
                        value: user ? user.status : '',
                        checked: 'active',
                        unchecked: 'suspended',
                        readonly: user.id === JSON.parse(localStorage.getItem('user')).id
                    },
                ]
            },
            {
                type: 'tabs',
                id: 'infoTabs',
                tabs: [
                    {
                        heading: 'info',
                        content: [
                            {
                                type: 'text',
                                id: 'name',
                                name: 'name',
                                placeholder: 'name',
                                hasErrors: false,
                                required: true,
                                value: user ? user.name : '',
                                updated: false
                            },
                            {
                                type: 'text',
                                id: 'login',
                                name: 'login',
                                placeholder: 'login',
                                hasErrors: false,
                                errorMessage: null,
                                required: true,
                                value: user ? user.login : '',
                                updated: false
                            },
                            {
                                type: 'text',
                                id: 'password',
                                name: 'password',
                                placeholder: 'password',
                                hasErrors: false,
                                required: true,
                                value: user ? user.password : '',
                                updated: false,
                                btn: {
                                    icon: 'fas fa-random',
                                    action: passwordAction ? passwordAction : null,
                                    title: translate('generate')
                                }
                            },
                            {
                                type: 'block',
                                id: 'contactsBlock',
                                heading: 'contacts',
                                children: [
                                    {
                                        type: 'email',
                                        id: 'email',
                                        name: 'email',
                                        placeholder: 'email',
                                        hasErrors: false,
                                        value: user ? user.email : '',
                                        updated: false,
                                        icon: 'far fa-envelope'
                                    },
                                    {
                                        type: 'tel',
                                        id: 'tel',
                                        name: 'tel',
                                        placeholder: 'tel',
                                        hasErrors: false,
                                        value: user ? user.tel : '',
                                        updated: false,
                                        icon: 'fas fa-mobile-alt'
                                    },
                                    {
                                        type: 'text',
                                        id: 'skype',
                                        name: 'skype',
                                        placeholder: 'skype',
                                        hasErrors: false,
                                        value: user ? user.skype : '',
                                        updated: false,
                                        icon: 'fab fa-skype'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        return formFields;
    }
}