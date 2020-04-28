import React, {useContext, useEffect, useState} from 'react';
import Form from "../../components/Form/Form";
import Preloader from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";

export default function AdminClassDescr({loading, classData, canEdit, setDescr}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ classDescrFields, setClassDescrFields ] = useState([]);

    useEffect(() => {
        if ( classData ) {
            setClassDescrFields(Object.assign([], [
                {
                    value: classData.info.ua,
                    id: 'descr_ua',
                    placeholder: translate('description') + ' ' + translate('in_ua'),
                    type: 'textarea',
                    updated: false
                },
                {
                    value: classData.info.ru,
                    id: 'descr_ru',
                    placeholder: translate('description') + ' ' + translate('in_ru'),
                    type: 'textarea',
                    updated: false
                },
                {
                    value: classData.info.en,
                    id: 'descr_en',
                    placeholder: translate('description') + ' ' + translate('in_en'),
                    type: 'textarea',
                    updated: false
                }
            ]));
        }
    }, [classData]);

    return (
        <div className="widget">
            <div className="widget__title">
                <i className="content_title-icon fa fa-question"/>
                { translate('description') }
            </div>
            {
                classData ?
                    canEdit() ?
                        <Form fields={classDescrFields} setFieldValue={setDescr} loading={loading} />
                        :
                        classData.info[lang] ? classData.info[lang] : classData.info['ua']
                    :
                    loading ?
                        <Preloader/>
                        :
                        null
            }
        </div>
    );
}