import React, { useContext } from 'react';
import FlagIcon from "../../factories/flagIconFactory";
import './languageSelect.scss';
import siteSettingsContext from '../../context/siteSettingsContext';
import Dropdown from "../dropdown/dropdown";

const LanguageSelect = () => {
    const { lang, translate, changeLang } = useContext(siteSettingsContext);

    return (
        <div className="languageSelect">
            <Dropdown width={65} trigger={<span><FlagIcon squared code={lang === 'en' ? 'gb' : lang } className="languageSelect_icon header__icon" /><span className="header__icon-descr">{ translate('language') }</span></span>}>
                <div className="languageSelect_item">
                    <span className="languageSelect_link" onClick={() => changeLanguage('ua')}>
                        <FlagIcon code={'ua'} squared className="languageSelect_icon" />
                        <span className="languageSelect_text">Укр</span>
                    </span>
                </div>
                <div className="languageSelect_item">
                    <span className="languageSelect_link" onClick={() => changeLanguage('ru')}>
                        <FlagIcon code={'ru'} squared className="languageSelect_icon" />
                        <span className="languageSelect_text">Rus</span>
                    </span>
                </div>
                <div className="languageSelect_item">
                    <span className="languageSelect_link" onClick={() => changeLanguage('en')}>
                        <FlagIcon code={'gb'} squared className="languageSelect_icon" />
                        <span className="languageSelect_text">Eng</span>
                    </span>
                </div>
            </Dropdown>
        </div>
    );

    function changeLanguage(newLang) {
        if ( newLang !== lang ) {
            changeLang(newLang);
        }
    }
};
export default LanguageSelect;