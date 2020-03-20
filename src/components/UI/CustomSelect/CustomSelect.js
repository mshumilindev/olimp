import React, { useContext, useState, useEffect } from 'react';
import classNames from "classnames";
import './customSelect.scss';
import siteSettingsContext from "../../../context/siteSettingsContext";

export default function CustomSelect({options, placeholder, name, updated, id, value, selectChanged, hasReset, required, hasErrors}) {
    const { translate } = useContext(siteSettingsContext);
    const [ isActive, setIsActive ] = useState(false);

    useEffect(() => {
        setIsActive(false);
    }, [value]);

    return (
        <div className="customSelect">
            <div className="form__field-holder" onClick={() => setIsActive(true)}>
                <input className={classNames('form__field customSelect__value', {isUpdated: updated, required: required, hasErrors: hasErrors, isActive: isActive})} type="text" title={name} value={value} readOnly onChange={e => e} />
                <i className="fa fa-chevron-down customSelect__arrow" />
                {
                    placeholder ?
                        <span className={classNames('form__field-placeholder', { isFilled: value })}>{ placeholder }</span>
                        :
                        null
                }
                <div className="customSelect__drop">
                    {
                        hasReset && value ?
                            <div className="customSelect__drop-opt isReset" onClick={() => selectOpt(id, '')}>{ translate('reset') }</div>
                            :
                            null
                    }
                    {
                        options.map(opt => _renderOpt(opt))
                    }
                </div>
            </div>
        </div>
    );

    function _renderOpt(opt) {
        return (
            <div className="customSelect__drop-opt" key={opt.id} onClick={() => selectOpt(id, opt.id)} id={opt.id}>
                {
                    opt.icon ?
                        <i className={opt.icon} style={{width: 20, textAlign: 'center', marginRight: 5}} />
                        :
                        null
                }
                { opt.title }
            </div>
        );
    }

    function selectOpt(fieldID, value) {
        selectChanged(fieldID, value);
    }
}