import React, { useContext } from 'react';
import classNames from "classnames";
import './customSelect.scss';
import siteSettingsContext from "../../../context/siteSettingsContext";

export default function CustomSelect({options, placeholder, name, updated, id, value, selectChanged, hasReset}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="customSelect">
            <div className="form__field-holder">
                <input className={classNames('form__field customSelect__value', {isUpdated: updated})} type="text" title={name} value={value} readOnly onChange={e => e} />
                <i className="fa fa-chevron-down customSelect__arrow" />
                <span className={classNames('form__field-placeholder', { isFilled: value })}>{ placeholder }</span>
                <div className="customSelect__drop">
                    {
                        hasReset && value ?
                            <div className="customSelect__drop-opt isReset" onClick={() => selectOpt(id, '')}>{ translate('reset') }</div>
                            :
                            null
                    }
                    {
                        options.map(opt => <div className="customSelect__drop-opt" key={opt.id} onClick={() => selectOpt(id, opt.id)}>{ opt.title }</div>)
                    }
                </div>
            </div>
        </div>
    );

    function selectOpt(fieldID, value) {
        selectChanged(fieldID, value);
    }
}