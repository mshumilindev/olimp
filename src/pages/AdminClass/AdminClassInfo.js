import React, {useContext, useMemo} from 'react';
import Form from "../../components/Form/Form";
import Preloader from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";

export default function AdminClassInfo({loading, classData, canEdit, setInfo}) {
    const { translate, lang } = useContext(siteSettingsContext);

    const classInfoFields = useMemo(() => {
        if ( classData ) {
            return (
                [
                    {
                        value: classData.title.ua,
                        id: 'title_ua',
                        placeholder: translate('title') + ' ' + translate('in_ua'),
                        type: 'text',
                        updated: false
                    },
                    {
                        value: classData.title.ru,
                        id: 'title_ru',
                        placeholder: translate('title') + ' ' + translate('in_ru'),
                        type: 'text',
                        updated: false
                    },
                    {
                        value: classData.title.en,
                        id: 'title_en',
                        placeholder: translate('title') + ' ' + translate('in_en'),
                        type: 'text',
                        updated: false
                    }
                ]
            )
        }

        return [];
    }, [classData, translate]);

    return (
        <div className="widget">
            <div className="widget__title">
                <i className="content_title-icon fa fa-info"/>
                { translate('info') }
            </div>
            {
                classData ?
                    canEdit ?
                        <Form fields={classInfoFields} setFieldValue={setInfo} loading={loading} />
                        :
                        classData.title[lang] ? classData.title[lang] : classData.title['ua']
                    :
                    loading ?
                        <Preloader/>
                        :
                        null
            }
        </div>
    );
}