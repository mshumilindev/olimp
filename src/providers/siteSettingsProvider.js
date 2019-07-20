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
            identify: (value) => {
                return this.identify(value);
            },
            transliterize: (value) => {
                return this.transliterize(value);
            },
            getUserFormFields: (user, passwordAction) => {
                return this.getUserFormFields(user, passwordAction);
            },
            getUserModel: (role, id) => {
                return this.getUserModel(role, id);
            },
            getDocFormFields: (name, tags, action) => {
                return this.getDocFormFields(name, tags, action);
            },
            getSubjectModel: () => {
                return this.getSubjectModel();
            },
            getSubjectFields: (subject) => {
                return this.getSubjectFields(subject);
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

    identify(value) {
        return value.replace(/^a-z0-9]/gi,'').split(' ').join('_').toLowerCase();
    }

    transliterize(value) {
        let newValue = value.split('');

        const dictionary = {
            'А': 'A',
            'а': 'a',
            'Б': 'B',
            'б': 'b',
            'В': 'V',
            'в': 'v',
            'Г': 'H',
            'г': 'h',
            'Д': 'D',
            'д': 'd',
            'Е': 'E',
            'е': 'e',
            'Є': 'Ie',
            'є': 'ie',
            'Ж': 'Zh',
            'ж': 'zh',
            'З': 'Z',
            'з': 'z',
            'И': 'Y',
            'и': 'y',
            'І': 'I',
            'і': 'i',
            'Ї': 'Ii',
            'ї': 'ii',
            'Й': 'Y',
            'й': 'y',
            'К': 'K',
            'к': 'k',
            'Л': 'L',
            'л': 'l',
            'М': 'M',
            'м': 'm',
            'Н': 'N',
            'н': 'n',
            'О': 'O',
            'о': 'o',
            'П': 'P',
            'п': 'p',
            'Р': 'R',
            'р': 'r',
            'С': 'S',
            'с': 's',
            'Т': 'T',
            'т': 't',
            'У': 'U',
            'у': 'u',
            'Ф': 'F',
            'ф': 'f',
            'Х': 'Kh',
            'х': 'kh',
            'Ц': 'Ts',
            'ц': 'ts',
            'Ч': 'Ch',
            'ч': 'ch',
            'Ш': 'Sh',
            'ш': 'sh',
            'Щ': 'Shch',
            'щ': 'shch',
            'Ь': '\'',
            'ь': '\'',
            'Ю': 'Iu',
            'ю': 'iu',
            'Я': 'Ia',
            'я': 'ia'
        };

        newValue.forEach((char, index) => {
            if ( dictionary[char] ) {
                newValue[index] = dictionary[char];
            }
        });

        return newValue.join('');
    }

    getSubjectModel() {
        return {
            name: {
                ua: '',
                ru: '',
                en: ''
            },
            id: ''
        }
    }

    getSubjectFields(subject) {
        const { translate } = this.state;

        return [
            {
                type: 'text',
                name: 'subjectName_ua',
                id: 'subjectName_ua',
                placeholder: translate('title') + ' ' + translate('in_ua'),
                value: subject.name.ua,
                required: true,
                updated: false
            },
            {
                type: 'text',
                name: 'subjectName_ru',
                id: 'subjectName_ru',
                placeholder: translate('title') + ' ' + translate('in_ru'),
                value: subject.name.ru,
                updated: false
            },
            {
                type: 'text',
                name: 'subjectName_en',
                id: 'subjectName_en',
                placeholder: translate('title') + ' ' + translate('in_en'),
                value: subject.name.en,
                updated: false
            },
            {
                type: 'submit',
                name: subject.id ? translate('update') : translate('create'),
                id: 'subjectSubmit',
            }
        ]
    }

    getUserModel(role) {
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

        // === Need to move this to json file
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

    getDocFormFields(name, tags, action) {
        const { translate } = this.state;

        // === Need to move this to json file
        return [
            {
                type: 'text',
                name: 'name',
                id: 'name',
                placeholder: translate('title'),
                value: name,
                required: true,
                updated: false
            },
            {
                type: 'itemList',
                name: 'tags',
                id: 'tags',
                placeholder: translate('tags'),
                value: tags,
                updated: false
            },
            {
                type: 'submit',
                name: action,
                id: 'upload'
            }
        ];
    }
}