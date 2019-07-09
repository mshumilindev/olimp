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

    getUserFormFields(user, passwordAction) {
        const { translate } = this.state;

        const formFields = [
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
                type: 'select',
                id: 'role',
                name: 'role',
                placeholder: 'role',
                hasErrors: false,
                required: true,
                value: user ? user.role : '',
                updated: false,
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
            }
        ];

        // if ( user.role === 'teacher' ) {
        //     // === Teacher fields need to be pushed here
        // }
        // if ( user.role === 'student' ) {
        //     // === Student fields need to be pushed here
        // }

        return formFields;
    }
}