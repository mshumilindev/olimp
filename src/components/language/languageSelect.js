import React from 'react';
import FlagIcon from "../../factories/flagIconFactory";
import './languageSelect.scss';
import siteSettingsContext from '../../context/siteSettingsContext';
import Dropdown from "../dropdown/dropdown";

export default class LanguageSelect extends React.Component {
    render() {
        const { lang, translate } = this.context;

        return (
            <div className="languageSelect">
                <Dropdown width={65} trigger={<span><FlagIcon code={lang === 'en' ? 'gb' : lang } className="languageSelect_icon header_icon" /><span className="header_icon-descr">{ translate('language') }</span></span>}>
                    <div className="languageSelect_item">
                        <span className="languageSelect_link" onClick={() => this.changeLanguage('ua')}>
                            <FlagIcon code={'ua'} className="languageSelect_icon" />
                            <span className="languageSelect_text">Укр</span>
                        </span>
                    </div>
                    <div className="languageSelect_item">
                        <span className="languageSelect_link" onClick={() => this.changeLanguage('ru')}>
                            <FlagIcon code={'ru'} className="languageSelect_icon" />
                            <span className="languageSelect_text">Rus</span>
                        </span>
                    </div>
                    <div className="languageSelect_item">
                        <span className="languageSelect_link" onClick={() => this.changeLanguage('en')}>
                            <FlagIcon code={'gb'} className="languageSelect_icon" />
                            <span className="languageSelect_text">Eng</span>
                        </span>
                    </div>
                </Dropdown>
            </div>
        )
    }

    changeLanguage(newLang) {
        const { lang } = this.context;

        if ( newLang !== lang ) {
            this.context.changeLang(newLang);
        }
    }
}
LanguageSelect.contextType = siteSettingsContext;