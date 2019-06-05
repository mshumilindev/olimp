import React from 'react';
import SiteSettingsContext from '../context/siteSettingsContext';
import firebase from "../db/firestore";

const db = firebase.firestore();

export default class SiteSettingsProvider extends React.Component{
    constructor() {
        super();
        this.state = {
            siteName: 'КОЛЕГІУМ "ОЛІМП"',
            translations: {},
            lang: localStorage.getItem('lang'),
            level: '1a',
            changeLang: (lang) => {
                this.setLang(lang);
                this.getTranslations();
            },
            translate: (term) => {
                return this.state.translations[term] ? this.state.translations[term] : term;
            }
        };
    }

    componentDidMount() {
        if ( !this.state.lang ) {
            localStorage.setItem('lang', 'ua');
        }
        this.getTranslations();
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
        const navCollection = db.collection('translations').doc(localStorage.getItem('lang'));

        navCollection.get().then((doc) => {
            this.setState(() => {
                return {
                    translations: doc.data()
                }
            });
        });
    }
}