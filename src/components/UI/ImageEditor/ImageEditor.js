import React, {useContext, useState} from 'react';
import Form from "../../Form/Form";
import './imageEditor.scss';
import classNames from 'classnames';
import ImageEditorSize from "./tools/ImageEditorSize";
import ImageEditorDimensions from "./tools/ImageEditorDimensions";
import siteSettingsContext from "../../../context/siteSettingsContext";

export default function ImageEditor({id, image, settings, handleChange, setSettings}) {
    const [ isUsed, setIsUsed ] = useState(true);
    const { translate } = useContext(siteSettingsContext);
    const formFields = [
        {
            type: 'image',
            id: id + '_image',
            value: image,
            size: '100%',
            icon: 'fa fa-image',
            customSize: true,
            noImage: true
        },
    ];

    return (
        <div className={classNames('imageEditor', { isUsed: isUsed })}>
            <div className="imageEditor__overlay"/>
            <div className="imageEditor__box">
                <div className="imageEditor__inner">
                    {
                        image && isUsed ?
                            <>
                                <div className="imageEditor__toolbar">
                                    <div className="imageEditor__toolbar-col">
                                        <div className="imageEditor__icon">
                                            <i className="fas fa-image" />
                                        </div>
                                        <div className="imageEditor__toolbar-btn">
                                            <i className="imageEditor__toolbar-btn-icon fas fa-history"/>
                                            <div className="imageEditor__toolbar-btn-label">{ translate('original_settings') }</div>
                                        </div>
                                    </div>
                                    <div className="imageEditor__toolbar-col">
                                        <div className="imageEditor__toolbar-btn">
                                            <i className="imageEditor__toolbar-btn-icon fas fa-times"/>
                                            <div className="imageEditor__toolbar-btn-label">{ translate('close') }</div>
                                        </div>
                                    </div>
                                </div>
                                <ImageEditorDimensions dimensions={isOriginal() ? 'original' : settings.dimensions ? settings.dimensions : 'original'} setSettingsItem={setSettingsItem}/>
                                <ImageEditorSize size={settings.size ? settings.size : 100} setSettingsItem={setSettingsItem}/>
                            </>
                            :
                            null
                    }
                    {
                        image ?
                            isOriginal() ?
                                <img src={image} className="imageEditor__image"/>
                                :
                                <div className="imageEditor__image" style={{backgroundImage: 'url(' + image + ')'}}/>
                            :
                            null
                    }
                    <Form fields={formFields} setFieldValue={(fieldID, value) => handleChange(fieldID, value)}/>
                </div>
            </div>
        </div>
    );

    function isOriginal() {
        return !Object.keys(settings).length;
    }

    function setSettingsItem() {

    }
}