import React, {useContext, useEffect, useState} from 'react';
import './datepicker.scss';
import moment from "moment";
import CustomSelect from "../UI/CustomSelect/CustomSelect";
import SiteSettingsContext from "../../context/siteSettingsContext";
import classNames from 'classnames';

export default function Datepicker({value, onChange, time, required, hasErrors}) {
    const [ date, setDate ] = useState(null);
    const { translate } = useContext(SiteSettingsContext);

    useEffect(() => {
        if ( value ) {
            const dateFromValue = moment(value * 1000);
            let day = dateFromValue.format('DD');
            let month = dateFromValue.format('MM');
            let year = dateFromValue.format('YYYY');
            let time = dateFromValue.format('HH:mm');

            setDate({
                day: day,
                month: month,
                year: year,
                time: time
            });
        }
    }, [value]);

    return (
        <div className="form datepicker">
            {
                date ?
                    <div className="form__row">
                        <div className="form__field-holder">
                            <CustomSelect value={date.day} options={getDayOptions()} selectChanged={(fieldID, value) => handleChange(value, 2, 'day')} placeholder={translate('day')} required={required} hasErrors={hasErrors}/>
                            {/*<input type="text" className={classNames('datepicker__day form__field', { required: required, hasErrors: hasErrors})} value={date.day} onChange={e => handleChange(e.target.value, 2, 'day')}/>*/}
                            {/*<span className={classNames('form__field-placeholder', {isFilled: date.day})}>{ translate('date') }</span>*/}
                        </div>
                        <div className="form__field-holder">
                            <CustomSelect value={date.month} options={getMonthOptions()} selectChanged={(fieldID, value) => handleChange(value, 2, 'month')} placeholder={translate('month')} required={required} hasErrors={hasErrors}/>
                            {/*<input type="text" className={classNames('datepicker__day form__field', { required: required, hasErrors: hasErrors})} value={date.month} onChange={e => handleChange(e.target.value, 2, 'month')}/>*/}
                            {/*<span className={classNames('form__field-placeholder', {isFilled: date.month})}>{ translate('month') }</span>*/}
                        </div>
                        <div className="form__field-holder">
                            <CustomSelect value={date.year} options={getYearOptions()} selectChanged={(fieldID, value) => handleChange(value, 4, 'year')} placeholder={translate('year')} required={required} hasErrors={hasErrors}/>
                        </div>
                        {
                            time ?
                                <div className="form__field-holder">
                                    <CustomSelect value={date.time} options={getTimeOptions()} selectChanged={(fieldID, value) => handleTimeChange(value)} placeholder={translate('time')} required={required} hasErrors={hasErrors} />
                                </div>
                                :
                                null
                        }
                    </div>
                    :
                    null
            }
        </div>
    );

    function handleTimeChange(value) {
        onChange(moment(date.month + '.' + date.day + '.' + date.year + ' ' + value).unix());
    }

    function getTimeOptions() {
        const options = [];
        let m = 0;
        let h = 9;

        while ( h <= 16 ) {
            while ( m < 60 ) {
                options.push({
                    id: (('' + h).length === 1 ? '0' + h : '' + h) + ':' + (('' + m).length === 1 ? '0' + m : '' + m),
                    title: (('' + h).length === 1 ? '0' + h : '' + h) + ':' + (('' + m).length === 1 ? '0' + m : '' + m)
                });
                m += 15;
            }
            m = 0;
            h++;
        }
        options.push({
            id: '17:00',
            title: '17:00'
        });

        return options;
    }

    function getDayOptions() {
        let i = 1;
        const options = [];

        while ( i <= daysInMonth(parseInt(date.month), parseInt(date.year)) ) {
            options.push({
                id: ('' + i).length === 1 ? '0' + i : '' + i,
                title: ('' + i).length === 1 ? '0' + i : '' + i
            });
            i++;
        }

        return options;
    }

    function getMonthOptions() {
        let i = 1;
        const options = [];

        while ( i <= 12 ) {
            options.push({
                id: ('' + i).length === 1 ? '0' + i : '' + i,
                title: ('' + i).length === 1 ? '0' + i : '' + i
            });
            i ++;
        }

        return options;
    }

    function getYearOptions() {
        let i = moment().format('YYYY');
        const options = [];

        while ( i < parseInt(moment().format('YYYY')) + 5 ) {
            options.push({
                id: '' + i,
                title: '' + i
            });
            i++;
        }
        return options;
    }

    function handleChange(value, maxLength, type) {
        let newValue = parseInt(value);
        newValue = ('' + newValue);

        if ( newValue.length > maxLength ) {
            if ( newValue.indexOf('0') === 0 ) {
                newValue.replace('0', '');
            }
            else {
                return false;
            }
        }
        if ( newValue.length === 1 ) {
            if ( newValue.indexOf('0') === 0 ) {
                newValue = '01';
            }
            else {
                newValue = '0' + newValue;
            }
        }
        if ( type === 'day' ) {
            if ( parseInt(newValue) > daysInMonth(parseInt(date.month), parseInt(date.year)) ) {
                newValue = '' + daysInMonth(parseInt(date.month), parseInt(date.year));
            }
            onChange(moment(date.month + '.' + newValue + '.' + date.year + ' ' + date.time).unix());
        }
        if ( type === 'month' ) {
            if ( parseInt(newValue) > 12 ) {
                newValue = '12';
            }
            if ( parseInt(date.day) > daysInMonth(parseInt(newValue), parseInt(date.year)) ) {
                onChange(moment(newValue + '.' + daysInMonth(parseInt(newValue), parseInt(date.year)) + '.' + date.year + ' ' + date.time).unix())
            }
            else {
                onChange(moment(newValue + '.' + date.day + '.' + date.year + ' ' + date.time).unix());
            }
        }
        if ( type === 'year' ) {
            if ( parseInt(date.day) > daysInMonth(parseInt(date.month), parseInt(newValue)) ) {
                onChange(moment(date.month + '.' + daysInMonth(parseInt(date.month), parseInt(newValue)) + '.' + newValue + ' ' + date.time).unix())
            }
            else {
                onChange(moment(date.month + '.' + date.day + '.' + newValue + ' ' + date.time).unix());
            }
        }
    }

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }
}